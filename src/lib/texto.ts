/**
 * Formatação mínima para textos editáveis em src/content/:
 *   *ênfase*  → <em>      **forte** → <strong>      [texto](/link) → <a>
 * O texto é escapado antes, então HTML digitado no conteúdo não é interpretado.
 */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Destinos aceitos em [texto](link): caminho interno, âncora, https, tel e mailto.
 * Qualquer outro esquema (javascript:, data:, http: etc.) vira texto simples.
 */
const linkPermitido = (href: string) =>
  /^(\/(?!\/)|#|https:\/\/|tel:|mailto:)/i.test(href.replace(/&amp;/g, '&'));

export function inline(texto: string): string {
  return escapar(texto)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, rotulo: string, href: string) => {
      if (!linkPermitido(href)) return rotulo;
      const externo = /^https:\/\//.test(href);
      const attrs = externo ? ' rel="noopener" target="_blank"' : '';
      return `<a href="${href}"${attrs}>${rotulo}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Remove marcações de ênfase (para <title>, aria-label etc.). */
export function semMarcacao(texto: string): string {
  return texto.replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}
