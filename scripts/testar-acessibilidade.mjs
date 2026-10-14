// Teste automático de acessibilidade (axe-core) + capturas de tela.
// Serve a pasta dist/ localmente e abre cada página no Microsoft Edge ou no
// Google Chrome já instalados (playwright-core, sem baixar navegadores).
//
// Uso:  npm run build && npm run test:a11y
//       npm run test:a11y -- --capturas      (salva capturas em relatorios/)
//       NAVEGADOR=chrome npm run test:a11y
import { createServer } from 'node:http';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright-core';

const require = createRequire(import.meta.url);
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const RELATORIOS = fileURLToPath(new URL('../relatorios/', import.meta.url));
const capturas = process.argv.includes('--capturas');
const LARGURAS = [360, 768, 1024, 1440];

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

async function existe(caminho) {
  try {
    return (await stat(caminho)).isFile();
  } catch {
    return false;
  }
}

// Servidor estático que imita o Cloudflare Pages (URLs sem .html)
const servidor = createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const candidatos =
    url === '/'
      ? ['index.html']
      : [url.slice(1), `${url.slice(1)}.html`, `${url.slice(1)}/index.html`];
  for (const c of candidatos) {
    const arquivo = join(DIST, c);
    if (await existe(arquivo)) {
      res.writeHead(200, { 'Content-Type': tipos[extname(arquivo)] ?? 'application/octet-stream' });
      res.end(await readFile(arquivo));
      return;
    }
  }
  res.writeHead(404, { 'Content-Type': tipos['.html'] });
  res.end(await readFile(join(DIST, '404.html')));
});
await new Promise((r) => servidor.listen(4329, r));
const BASE = 'http://localhost:4329';

async function paginas(dir = DIST, prefixo = '') {
  const lista = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (item.isDirectory() && !item.name.startsWith('_'))
      lista.push(...(await paginas(join(dir, item.name), `${prefixo}/${item.name}`)));
    else if (item.name.endsWith('.html')) {
      const nome = item.name.replace(/\.html$/, '');
      lista.push(nome === 'index' ? prefixo || '/' : `${prefixo}/${nome}`);
    }
  }
  return lista.sort();
}

const navegador = await chromium.launch({
  channel: process.env.NAVEGADOR === 'chrome' ? 'chrome' : 'msedge',
});
const axeFonte = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
if (capturas) await mkdir(RELATORIOS, { recursive: true });

let falhas = 0;
for (const rota of await paginas()) {
  for (const largura of capturas ? LARGURAS : [360, 1440]) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: 900 },
      reducedMotion: 'reduce',
    });
    const pagina = await contexto.newPage();
    const erros = [];
    pagina.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
    pagina.on('pageerror', (e) => erros.push(e.message));
    await pagina.goto(BASE + rota, { waitUntil: 'networkidle' });

    const larguraDoc = await pagina.evaluate(() => document.documentElement.scrollWidth);
    await pagina.addScriptTag({ content: axeFonte });
    const resultado = await pagina.evaluate(async () =>
      // @ts-expect-error axe global
      window.axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      }),
    );

    const problemas = [];
    if (larguraDoc > largura) problemas.push(`rolagem horizontal (${larguraDoc}px > ${largura}px)`);
    for (const v of resultado.violations)
      problemas.push(
        `${v.id} (${v.impact}): ${v.help} — ${v.nodes
          .map((n) => n.target.join(' '))
          .slice(0, 3)
          .join(' | ')}`,
      );
    for (const e of erros) problemas.push(`console: ${e}`);

    if (problemas.length) {
      falhas += problemas.length;
      console.log(`✗ ${rota} @${largura}px`);
      problemas.forEach((p) => console.log(`    - ${p}`));
    } else {
      console.log(`✓ ${rota} @${largura}px`);
    }

    if (capturas) {
      // Rola até o fim para carregar imagens com loading="lazy"
      await pagina.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        window.scrollTo(0, 0);
      });
      await pagina.waitForLoadState('networkidle');
      // A captura de página inteira não renderiza seções com content-visibility fora da tela
      await pagina.addStyleTag({ content: '* { content-visibility: visible !important; }' });
      const nome =
        (rota === '/' ? 'inicio' : rota.slice(1).replace(/\//g, '-')) + `-${largura}.png`;
      await pagina.screenshot({ path: join(RELATORIOS, nome), fullPage: true });
    }
    await contexto.close();
  }
}

await navegador.close();
servidor.close();
console.log(
  falhas ? `\n${falhas} problema(s) encontrado(s).` : '\nNenhum problema encontrado pelo axe.',
);
process.exit(falhas ? 1 : 0);
