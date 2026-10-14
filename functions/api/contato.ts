/**
 * POST /api/contato — Cloudflare Pages Function
 * ------------------------------------------------------------------
 * Recebe o formulário, valida no servidor, verifica antispam e envia um
 * e-mail transacional (Resend) para a clínica.
 *  - SEM banco de dados e SEM logs com o conteúdo do formulário.
 *  - Antispam: honeypot + tempo mínimo de preenchimento + Cloudflare Turnstile
 *    + limite de requisições por IP.
 * Variáveis (secretas, configuradas no painel): CONTACT_EMAIL, CONTACT_FROM,
 * RESEND_API_KEY, TURNSTILE_SECRET_KEY. Opcional: binding RATE_LIMITER
 * (Workers Rate Limiting). Sem CONTACT_EMAIL, a função responde 503.
 */
import { normalizar, validar, TEMPO_MINIMO_MS, type DadosContato } from '../../src/lib/formulario';

interface Env {
  CONTACT_EMAIL?: string;
  CONTACT_FROM?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMITER?: { limit: (opcoes: { key: string }) => Promise<{ success: boolean }> };
}

interface Contexto {
  request: Request;
  env: Env;
}

const LIMITE_POR_JANELA = 5;
const JANELA_MS = 10 * 60 * 1000;
// Limite em memória (por instância). Complementa a regra de Rate Limiting do Cloudflare.
const tentativas = new Map<string, { contagem: number; desde: number }>();

function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function limiteExcedido(ip: string, env: Env): Promise<boolean> {
  if (env.RATE_LIMITER) {
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    return !success;
  }
  const agora = Date.now();
  const registro = tentativas.get(ip);
  if (!registro || agora - registro.desde > JANELA_MS) {
    tentativas.set(ip, { contagem: 1, desde: agora });
    return false;
  }
  registro.contagem += 1;
  return registro.contagem > LIMITE_POR_JANELA;
}

async function turnstileValido(token: string, ip: string, segredo: string): Promise<boolean> {
  if (!token) return false;
  const corpo = new FormData();
  corpo.append('secret', segredo);
  corpo.append('response', token);
  corpo.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: corpo,
  });
  const dados = (await r.json()) as { success?: boolean };
  return dados.success === true;
}

const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function corpoEmail(d: DadosContato): { texto: string; html: string } {
  const linhas: [string, string][] = [
    ['Nome', d.nome],
    ['Telefone/WhatsApp', d.telefone],
    ['E-mail', d.email || '(não informado)'],
    ['Área de interesse', d.area],
    ['Para quem', d.paraQuem],
    ['Melhor período', d.periodo],
    ['Consentimento LGPD', 'Sim'],
  ];
  return {
    texto: `Novo pedido de contato pelo site\n\n${linhas.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`,
    html: `<h2>Novo pedido de contato pelo site</h2><table>${linhas
      .map(([k, v]) => `<tr><th align="left">${escapar(k)}</th><td>${escapar(v)}</td></tr>`)
      .join('')}</table>`,
  };
}

async function ler(request: Request): Promise<Record<string, unknown>> {
  const tipo = request.headers.get('Content-Type') ?? '';
  if (tipo.includes('application/json')) return (await request.json()) as Record<string, unknown>;
  const form = await request.formData();
  const obj: Record<string, unknown> = Object.fromEntries(form.entries());
  obj.token = form.get('cf-turnstile-response') ?? '';
  return obj;
}

export async function onRequestPost({ request, env }: Contexto): Promise<Response> {
  if (!env.CONTACT_EMAIL || !env.CONTACT_FROM || !env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
    return json({ erro: 'Formulário indisponível.' }, 503);
  }

  // Aceita apenas envios vindos do próprio site
  const origem = request.headers.get('Origin');
  if (origem && new URL(origem).host !== new URL(request.url).host) {
    return json({ erro: 'Origem não permitida.' }, 403);
  }

  const tamanho = Number(request.headers.get('Content-Length') ?? '0');
  if (tamanho > 10_000) return json({ erro: 'Requisição muito grande.' }, 413);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'desconhecido';
  if (await limiteExcedido(ip, env)) {
    return json(
      { erro: 'Muitas tentativas. Tente novamente mais tarde ou fale pelo WhatsApp.' },
      429,
    );
  }

  let entrada: Record<string, unknown>;
  try {
    entrada = await ler(request);
  } catch {
    return json({ erro: 'Dados inválidos.' }, 400);
  }

  // Honeypot e tempo mínimo: respostas "de sucesso" silenciosas para não orientar robôs
  const inicio = Number(entrada.inicio);
  if (String(entrada.site ?? '').trim() !== '') return json({ ok: true });
  if (!Number.isFinite(inicio) || Date.now() - inicio < TEMPO_MINIMO_MS) return json({ ok: true });

  if (!(await turnstileValido(String(entrada.token ?? ''), ip, env.TURNSTILE_SECRET_KEY))) {
    return json({ erro: 'Não foi possível confirmar que você não é um robô.' }, 400);
  }

  const dados = normalizar(entrada);
  const erros = validar(dados);
  if (Object.keys(erros).length > 0) return json({ erros }, 422);

  const { texto, html } = corpoEmail(dados);
  const envio = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_EMAIL],
      ...(dados.email ? { reply_to: dados.email } : {}),
      subject: `Contato pelo site: ${dados.area}`,
      text: texto,
      html,
    }),
  });

  if (!envio.ok) {
    // Registra apenas o código de status — nunca o conteúdo do formulário.
    console.error(`Falha no envio de e-mail (status ${envio.status}).`);
    return json({ erro: 'Falha no envio.' }, 502);
  }

  return json({ ok: true });
}

export function onRequest(): Response {
  return json({ erro: 'Método não permitido.' }, 405);
}
