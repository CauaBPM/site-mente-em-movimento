/**
 * Script global (todas as páginas):
 * 1. Revela seções com fade + deslocamento de 12 px (uma única vez).
 * 2. Desenha a trajetória uma única vez quando entra na tela.
 * 3. Registra eventos de clique (WhatsApp, telefone, como chegar) na ferramenta
 *    de análise sem cookies, se houver uma configurada.
 * Com prefers-reduced-motion, o CSS já mantém tudo visível e estático.
 */
import { registrarEvento } from './analytics';

const alvos = document.querySelectorAll<HTMLElement | SVGElement>(
  '[data-revelar], .trajetoria[data-desenhar]',
);

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  alvos.forEach((el) => observador.observe(el));
} else {
  alvos.forEach((el) => el.classList.add('visivel'));
}

const nomes: Record<string, string> = {
  whatsapp: 'Clique no WhatsApp',
  telefone: 'Clique no telefone',
  'como-chegar': 'Clique em Como chegar',
};

document.addEventListener('click', (e) => {
  const alvo = (e.target as Element | null)?.closest<HTMLElement>('[data-evento]');
  if (!alvo) return;
  const evento = alvo.dataset.evento ?? '';
  registrarEvento(nomes[evento] ?? evento, {
    origem: alvo.dataset.origem ?? 'desconhecida',
    pagina: location.pathname,
  });
});
