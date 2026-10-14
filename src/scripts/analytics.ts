/**
 * Envia um evento para a ferramenta de análise sem cookies configurada
 * (Plausible ou Umami). Se nenhuma estiver ativa, não faz nada.
 * Nunca envie dados pessoais ou de saúde como propriedade de evento.
 */
type Props = Record<string, string>;

declare global {
  interface Window {
    plausible?: (evento: string, opcoes?: { props?: Props }) => void;
    umami?: { track: (evento: string, dados?: Props) => void };
  }
}

export function registrarEvento(nome: string, props: Props = {}): void {
  try {
    if (typeof window.plausible === 'function') window.plausible(nome, { props });
    else if (window.umami?.track) window.umami.track(nome, props);
  } catch {
    // A análise nunca deve quebrar a navegação.
  }
}
