/**
 * Formulário de contato: máscara, validação acessível e envio.
 * - Erros ao lado de cada campo (aria-describedby + aria-invalid)
 * - Resumo de erros que recebe o foco
 * - Estado de carregamento no botão, mensagem de sucesso e alternativa pelo WhatsApp em caso de falha
 */
import { mascararTelefone, normalizar, validar, type DadosContato } from '@/lib/formulario';
import { registrarEvento } from './analytics';

declare global {
  interface Window {
    turnstile?: { reset: (el?: string | HTMLElement) => void };
  }
}

const rotulos: Record<keyof DadosContato, string> = {
  nome: 'Nome',
  telefone: 'Telefone ou WhatsApp',
  email: 'E-mail',
  area: 'Área de interesse',
  paraQuem: 'Para quem é o atendimento',
  periodo: 'Melhor período para contato',
  consentimento: 'Consentimento',
};

const primeiroCampo: Record<keyof DadosContato, string> = {
  nome: '#f-nome',
  telefone: '#f-telefone',
  email: '#f-email',
  area: '#f-area',
  paraQuem: 'input[name="paraQuem"]',
  periodo: 'input[name="periodo"]',
  consentimento: 'input[name="consentimento"]',
};

document.querySelectorAll<HTMLFormElement>('[data-formulario]').forEach((form) => {
  const inicio = form.querySelector<HTMLInputElement>('[data-inicio]');
  if (inicio) inicio.value = String(Date.now());

  const telefone = form.querySelector<HTMLInputElement>('[data-mascara-telefone]');
  telefone?.addEventListener('input', () => {
    telefone.value = mascararTelefone(telefone.value);
  });

  const resumo = form.querySelector<HTMLElement>('[data-resumo]')!;
  const resumoLista = form.querySelector<HTMLElement>('[data-resumo-lista]')!;
  const retorno = form.querySelector<HTMLElement>('[data-retorno]')!;
  const botao = form.querySelector<HTMLButtonElement>('[data-enviar]')!;
  const botaoTexto = form.querySelector<HTMLElement>('[data-enviar-texto]')!;
  const whatsapp = form.dataset.whatsapp ?? '';

  function limparErros() {
    form.querySelectorAll<HTMLElement>('[data-erro]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    resumo.hidden = true;
    resumoLista.replaceChildren();
  }

  function mostrarErros(erros: Partial<Record<keyof DadosContato, string>>) {
    for (const [campo, mensagem] of Object.entries(erros) as [keyof DadosContato, string][]) {
      const alvo = form.querySelector<HTMLElement>(`[data-erro="${campo}"]`);
      if (alvo) alvo.textContent = mensagem;
      form
        .querySelectorAll<HTMLElement>(primeiroCampo[campo])
        .forEach((el) => el.setAttribute('aria-invalid', 'true'));
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = `${rotulos[campo]}: ${mensagem}`;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        form.querySelector<HTMLElement>(primeiroCampo[campo])?.focus();
      });
      item.append(link);
      resumoLista.append(item);
    }
    resumo.hidden = false;
    resumo.focus();
  }

  function carregando(sim: boolean) {
    botao.disabled = sim;
    botao.setAttribute('aria-busy', String(sim));
    botaoTexto.textContent = sim ? 'Enviando…' : 'Enviar';
  }

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limparErros();
    retorno.textContent = '';

    const bruto = Object.fromEntries(new FormData(form).entries());
    const dados = normalizar(bruto);
    const erros = validar(dados);
    if (Object.keys(erros).length > 0) {
      mostrarErros(erros);
      return;
    }

    carregando(true);
    try {
      const resposta = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...dados,
          site: bruto.site ?? '',
          inicio: bruto.inicio ?? '',
          token: bruto['cf-turnstile-response'] ?? '',
        }),
      });
      const corpo = (await resposta.json().catch(() => ({}))) as { erros?: typeof erros };

      if (resposta.ok) {
        form.reset();
        if (inicio) inicio.value = String(Date.now());
        retorno.innerHTML =
          'Recebemos seu contato. <strong>A equipe vai retornar pelo telefone informado</strong>, de segunda a sexta, das 7h às 20h.';
        retorno.focus();
        registrarEvento('Envio do formulário', { pagina: location.pathname });
      } else if (resposta.status === 422 && corpo.erros) {
        mostrarErros(corpo.erros);
      } else {
        throw new Error(String(resposta.status));
      }
    } catch {
      retorno.innerHTML = `Não foi possível enviar agora. Por favor, fale com a equipe pelo <a href="${whatsapp}" rel="noopener" target="_blank">WhatsApp (27) 99792-9358</a>.`;
      retorno.focus();
    } finally {
      carregando(false);
      window.turnstile?.reset();
    }
  });
});
