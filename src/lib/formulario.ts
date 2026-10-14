/**
 * Validação do formulário de contato — compartilhada entre o navegador
 * (src/scripts/formulario.ts) e o servidor (functions/api/contato.ts).
 * Sem dependências: este arquivo é importado pela função serverless.
 */

export const AREAS = [
  'Psiquiatria',
  'Neurologia',
  'Neuropsicologia',
  'Psicologia',
  'Psicopedagogia',
  'Não sei, preciso de orientação',
] as const;

export const PARA_QUEM = [
  'Para mim',
  'Para meu filho ou minha filha',
  'Para outro familiar',
] as const;

export const PERIODOS = ['Manhã', 'Tarde', 'Qualquer horário'] as const;

/** Tempo mínimo (ms) entre abrir a página e enviar — envios mais rápidos são tratados como robô. */
export const TEMPO_MINIMO_MS = 3000;

export interface DadosContato {
  nome: string;
  telefone: string;
  email: string;
  area: string;
  paraQuem: string;
  periodo: string;
  consentimento: boolean;
}

export type Erros = Partial<Record<keyof DadosContato, string>>;

const limpar = (v: unknown, max = 200) =>
  String(v ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export const apenasDigitos = (v: string) => v.replace(/\D/g, '');

/** Máscara brasileira: (27) 99999-9999 ou (27) 3333-3333 */
export function mascararTelefone(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function normalizar(entrada: Record<string, unknown>): DadosContato {
  return {
    nome: limpar(entrada.nome, 120),
    telefone: limpar(entrada.telefone, 20),
    email: limpar(entrada.email, 160).toLowerCase(),
    area: limpar(entrada.area, 60),
    paraQuem: limpar(entrada.paraQuem, 60),
    periodo: limpar(entrada.periodo, 30),
    consentimento:
      entrada.consentimento === true ||
      entrada.consentimento === 'on' ||
      entrada.consentimento === 'true',
  };
}

export function validar(d: DadosContato): Erros {
  const erros: Erros = {};
  if (d.nome.length < 2) erros.nome = 'Informe seu nome.';
  const tel = apenasDigitos(d.telefone);
  if (!tel) erros.telefone = 'Informe um telefone ou WhatsApp com DDD.';
  else if (tel.length < 10 || tel.length > 11 || tel.startsWith('0'))
    erros.telefone = 'Confira o número: use DDD + telefone, por exemplo (27) 99999-9999.';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email))
    erros.email = 'Confira o e-mail ou deixe o campo em branco.';
  if (!(AREAS as readonly string[]).includes(d.area)) erros.area = 'Escolha uma opção.';
  if (!(PARA_QUEM as readonly string[]).includes(d.paraQuem))
    erros.paraQuem = 'Escolha para quem é o atendimento.';
  if (!(PERIODOS as readonly string[]).includes(d.periodo))
    erros.periodo = 'Escolha o melhor período.';
  if (!d.consentimento)
    erros.consentimento = 'Para enviar, é preciso concordar com a Política de Privacidade.';
  return erros;
}
