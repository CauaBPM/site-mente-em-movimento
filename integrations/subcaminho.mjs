// Ajustes do site gerado para publicação em subcaminho (ex.: GitHub Pages em
// https://usuario.github.io/repositorio/) e para o modo "prévia".
//
// - BASE_PATH: prefixa os links internos escritos como "/caminho" no conteúdo
//   (os arquivos gerados pelo próprio Astro já recebem o prefixo).
// - PUBLIC_PREVIEW=true: marca todas as páginas com noindex e bloqueia o robots.txt,
//   para que a cópia de demonstração não seja indexada no lugar do domínio oficial.
// No domínio definitivo (sem BASE_PATH e sem prévia), nada é alterado.
import { readdir, readFile, writeFile, stat, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function listar(dir) {
  const out = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const c = join(dir, item.name);
    if (item.isDirectory()) out.push(...(await listar(c)));
    else out.push(c);
  }
  return out;
}

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** @param {{ base: string; site: string; previa: boolean }} opcoes */
export default function subcaminho({ base, site, previa }) {
  return {
    name: 'subcaminho',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (!base && !previa) return;
        const pasta = fileURLToPath(dir);
        const arquivos = await listar(pasta);
        const nomeBase = base.replace(/^\//, '');
        const naoBase = nomeBase ? `(?!${escapar(nomeBase)}/)` : '';
        const origem = new URL(site).origin;

        for (const arquivo of arquivos) {
          if (!/\.(html|xml|txt|webmanifest)$/.test(arquivo)) continue;
          let texto = await readFile(arquivo, 'utf8');

          if (base) {
            // Atributos com caminho absoluto do site
            texto = texto.replace(
              new RegExp(`((?:href|src|action|content)=")/(?!/)${naoBase}`, 'g'),
              `$1${base}/`,
            );
            // url(/...) em CSS inline
            texto = texto.replace(new RegExp(`(url\\(['"]?)/(?!/)${naoBase}`, 'g'), `$1${base}/`);
            // URLs absolutas do próprio site (canonical, Open Graph, JSON-LD, sitemap, robots)
            texto = texto.replace(
              new RegExp(`${escapar(origem)}/${naoBase}`, 'g'),
              `${origem}${base}/`,
            );
            // Manifesto
            if (arquivo.endsWith('.webmanifest')) {
              texto = texto.replace(new RegExp(`"/${naoBase}`, 'g'), `"${base}/`);
            }
          }

          if (previa && arquivo.endsWith('.html')) {
            texto = texto
              .replace(/<meta name="robots"[^>]*>/g, '')
              .replace('<head>', '<head><meta name="robots" content="noindex, nofollow">');
          }

          await writeFile(arquivo, texto);
        }

        if (previa) {
          await writeFile(join(pasta, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
          // GitHub Pages: "pagina.html" ao lado de uma pasta "pagina/" precisa de pagina/index.html
          for (const arquivo of arquivos.filter((a) => a.endsWith('.html'))) {
            const pastaIrma = arquivo.replace(/\.html$/, '');
            try {
              if ((await stat(pastaIrma)).isDirectory()) {
                await mkdir(pastaIrma, { recursive: true });
                await copyFile(arquivo, join(pastaIrma, 'index.html'));
              }
            } catch {
              // não há pasta com o mesmo nome
            }
          }
          await writeFile(join(pasta, '.nojekyll'), '');
        }

        logger.info(
          `Ajustes aplicados${base ? ` (subcaminho ${base})` : ''}${previa ? ' (prévia: noindex)' : ''}.`,
        );
      },
    },
  };
}
