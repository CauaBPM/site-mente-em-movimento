// Gera dist/_headers (Cloudflare Pages / Netlify) ao final do build.
// A CSP é montada a partir das funcionalidades ativadas por variável de
// ambiente e inclui o hash SHA-256 de cada <script> inline encontrado no HTML,
// para não precisar de 'unsafe-inline' em script-src.
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
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/** @param {{ env: Record<string, string> }} opcoes */
export default function cabecalhosSeguranca({ env }) {
  return {
    name: 'cabecalhos-seguranca',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const pasta = fileURLToPath(dir);
        const hashes = new Set();
        for (const arquivo of await listarHtml(pasta)) {
          const html = await readFile(arquivo, 'utf8');
          for (const [, atributos, conteudo] of html.matchAll(
            /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g,
          )) {
            const attrs = atributos ?? '';
            if (/\ssrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
            if (!conteudo.trim()) continue;
            hashes.add(`'sha256-${createHash('sha256').update(conteudo).digest('base64')}'`);
          }
        }

        const script = ["'self'", ...hashes];
        const connect = ["'self'"];
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

        const csp = [
          "default-src 'self'",
          `script-src ${script.join(' ')}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          `connect-src ${connect.join(' ')}`,
          `frame-src ${frame.join(' ')}`,
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          'upgrade-insecure-requests',
        ].join('; ');

        const conteudo = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
        await writeFile(join(pasta, '_headers'), conteudo);
        logger.info(`_headers gerado (${hashes.size} script(s) inline com hash na CSP).`);
      },
    },
  };
}
