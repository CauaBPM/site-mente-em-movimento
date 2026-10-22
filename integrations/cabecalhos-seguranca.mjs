// Políticas de segurança aplicadas ao final do build.
//
// 1. Em TODAS as páginas: <meta http-equiv="Content-Security-Policy"> e
//    <meta name="referrer">. É o que protege o site no GitHub Pages, que não
//    permite configurar cabeçalhos HTTP. A CSP inclui o hash SHA-256 de cada
//    <script> inline, para não precisar de 'unsafe-inline' em script-src.
//    Limites da meta tag (ignorados pelo navegador): frame-ancestors,
//    report-uri/report-to e sandbox — por isso não entram nela.
// 2. dist/_headers (Cloudflare Pages / Netlify): os mesmos valores como
//    cabeçalhos HTTP reais, mais os que só funcionam como cabeçalho
//    (frame-ancestors, X-Frame-Options, nosniff, Permissions-Policy, HSTS).
//    Não é gerado quando HOSPEDAGEM=github-pages, porque lá ele não tem efeito.
//
// Rode esta integração DEPOIS de qualquer outra que altere o HTML (os hashes
// precisam corresponder ao conteúdo final dos scripts).
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function listarHtml(dir) {
  const itens = await readdir(dir, { withFileTypes: true });
  const arquivos = await Promise.all(
    itens.map((item) => {
      const caminho = join(dir, item.name);
      if (item.isDirectory()) return listarHtml(caminho);
      return item.name.endsWith('.html') ? [caminho] : [];
    }),
  );
  return arquivos.flat();
}

function origem(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' ? u.origin : null;
  } catch {
    return null;
  }
}

const hashScript = (conteudo) =>
  `'sha256-${createHash('sha256').update(conteudo).digest('base64')}'`;

/** Hashes dos <script> inline executáveis de um HTML (ignora src= e JSON-LD). */
function hashesInline(html) {
  const hashes = [];
  for (const [, atributos, conteudo] of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = atributos ?? '';
    if (/\ssrc=/.test(attrs) || /type="application\/ld\+json"/.test(attrs)) continue;
    if (!conteudo.trim()) continue;
    hashes.push(hashScript(conteudo));
  }
  return hashes;
}

/** @param {{ env: Record<string, string> }} opcoes */
export default function cabecalhosSeguranca({ env }) {
  return {
    name: 'cabecalhos-seguranca',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const pasta = fileURLToPath(dir);
        const arquivos = await listarHtml(pasta);
        const paginas = new Map();
        const hashes = new Set();
        for (const arquivo of arquivos) {
          const html = await readFile(arquivo, 'utf8');
          paginas.set(arquivo, html);
          hashesInline(html).forEach((h) => hashes.add(h));
        }

        const script = ["'self'", ...hashes];
        const connect = ["'self'"];
        // Mapa do Google: só carregado após o clique do visitante (MapConsent)
        const frame = ['https://www.google.com', 'https://maps.google.com'];

        if (env.PUBLIC_FORM_ENABLED === 'true') {
          script.push('https://challenges.cloudflare.com');
          frame.push('https://challenges.cloudflare.com');
        }
        switch (env.PUBLIC_ANALYTICS) {
          case 'plausible':
            script.push('https://plausible.io');
            connect.push('https://plausible.io');
            break;
          case 'umami': {
            const o = origem(env.PUBLIC_UMAMI_SRC ?? '');
            if (o) {
              script.push(o);
              connect.push(o);
            }
            break;
          }
          case 'cloudflare':
            script.push('https://static.cloudflareinsights.com');
            connect.push('https://cloudflareinsights.com');
            break;
        }

        // Estilos: o Astro gera <style> inline e atributos style="" (posição de
        // grafismos, proporção de imagens). Atributos style não aceitam hash sem
        // 'unsafe-hashes', então style-src mantém 'unsafe-inline' — risco baixo,
        // porque scripts continuam restritos.
        const diretivas = [
          "default-src 'self'",
          `script-src ${script.join(' ')}`,
          "script-src-attr 'none'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          `connect-src ${connect.join(' ')}`,
          `frame-src ${frame.join(' ')}`,
          "media-src 'none'",
          "worker-src 'none'",
          "manifest-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          'upgrade-insecure-requests',
        ];
        const cspMeta = diretivas.join('; ');
        const cspHeader = [...diretivas, "frame-ancestors 'none'"].join('; ');
        const referrer = 'strict-origin-when-cross-origin';

        // 1. Meta tags em todas as páginas, logo após <head> (antes de qualquer script)
        const metas =
          `<meta http-equiv="Content-Security-Policy" content="${cspMeta}">` +
          `<meta name="referrer" content="${referrer}">`;
        for (const [arquivo, html] of paginas) {
          if (!html.includes('<head>')) {
            logger.warn(`Sem <head>: CSP não aplicada em ${arquivo}`);
            continue;
          }
          await writeFile(arquivo, html.replace('<head>', `<head>${metas}`));
        }

        // 2. _headers para hospedagens que o suportam
        if (env.HOSPEDAGEM === 'github-pages') {
          logger.info(
            `CSP por meta tag em ${paginas.size} página(s) (${hashes.size} script(s) inline com hash). ` +
              '_headers não gerado (GitHub Pages não o utiliza).',
          );
          return;
        }

        const conteudo = `/*
  Content-Security-Policy: ${cspHeader}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: ${referrer}
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
        await writeFile(join(pasta, '_headers'), conteudo);
        logger.info(
          `CSP por meta tag em ${paginas.size} página(s) e _headers gerado (${hashes.size} script(s) inline com hash).`,
        );
      },
    },
  };
}
