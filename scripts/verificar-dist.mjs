// Verificação automática do site gerado (dist/). Rode após `npm run build`.
// Confere: links internos e âncoras, 1 H1 por página, title/description únicos e
// dentro do limite, canonical, Open Graph, JSON-LD válido (sem AggregateRating/Review),
// lang, termos proibidos (placeholders, promessas), sitemap sem páginas pendentes
// e o tamanho do JavaScript da página inicial.
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const erros = [];
const avisos = [];

async function listar(dir) {
  const out = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const c = join(dir, item.name);
    if (item.isDirectory()) out.push(...(await listar(c)));
    else out.push(c);
  }
  return out;
}

const existe = async (p) => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

const arquivos = await listar(DIST);
const htmls = arquivos.filter((f) => f.endsWith('.html'));
const rotaDe = (f) => {
  const r =
    '/' +
    relative(DIST, f)
      .replace(/\\/g, '/')
      .replace(/\.html$/, '');
  return r === '/index' ? '/' : r;
};

const paginas = new Map();
for (const f of htmls) paginas.set(rotaDe(f), await readFile(f, 'utf8'));

// Texto visível (sem scripts/estilos/tags)
const textoVisivel = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

const proibidos = [
  [/lorem ipsum/i, 'lorem ipsum'],
  [/\bem breve\b/i, '"em breve"'],
  [/\[[^\]]*\]/, 'colchetes'],
  [/\bcura(r|s)?\b/i, '"cura"'],
  [/\bgaranti(a|mos|do|da)\b/i, '"garantia"'],
  [/resultados comprovados/i, '"resultados comprovados"'],
  [/\bo melhor\b|\ba melhor clínica\b/i, '"o melhor"'],
  [/transformando vidas|jornada de bem-estar/i, 'clichê de IA'],
  [/clinicamenteemmovimento@gmail\.com/i, 'e-mail não confirmado exibido'],
  [/\bundefined\b|\bnull\b|NaN/, 'valor vazio renderizado'],
  [/fonoaudiolog|terapia ocupacional|\bABA\b|indique e ganhe/i, 'serviço/campanha não confirmados'],
];

const titulos = new Map();
const descricoes = new Map();

for (const [rota, html] of paginas) {
  const onde = `${rota}:`;
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) erros.push(`${onde} ${h1} elementos <h1> (esperado 1)`);
  if (!/<html lang="pt-BR"/.test(html)) erros.push(`${onde} sem lang="pt-BR"`);

  const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (!titulo) erros.push(`${onde} sem <title>`);
  if (!desc) erros.push(`${onde} sem meta description`);
  const t = titulo.replace(/&amp;/g, '&');
  const d = desc.replace(/&amp;/g, '&');
  if (t.length > 60) avisos.push(`${onde} título com ${t.length} caracteres: "${t}"`);
  if (d.length > 155) avisos.push(`${onde} descrição com ${d.length} caracteres`);
  if (rota !== '/404') {
    if (titulos.has(t)) erros.push(`${onde} título repetido em ${titulos.get(t)}`);
    if (descricoes.has(d)) erros.push(`${onde} descrição repetida em ${descricoes.get(d)}`);
    titulos.set(t, rota);
    descricoes.set(d, rota);
  }
  if (!/Vila Velha/.test(t + d)) avisos.push(`${onde} título/descrição sem "Vila Velha"`);

  for (const meta of [
    'rel="canonical"',
    'property="og:title"',
    'property="og:image"',
    'property="og:site_name"',
    'name="twitter:card"',
  ]) {
    if (!html.includes(meta)) erros.push(`${onde} sem ${meta}`);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
  if (!/^https:\/\//.test(canonical)) erros.push(`${onde} canonical não absoluto: ${canonical}`);

  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      const dado = JSON.parse(json);
      if (/AggregateRating|"Review"/.test(json))
        erros.push(`${onde} JSON-LD com avaliação própria`);
      if (!dado['@context'] || !dado['@type']) erros.push(`${onde} JSON-LD sem @context/@type`);
    } catch {
      erros.push(`${onde} JSON-LD inválido`);
    }
  }

  const texto = textoVisivel(html);
  for (const [re, nome] of proibidos) {
    const m = texto.match(re);
    if (m)
      erros.push(
        `${onde} termo proibido (${nome}): "…${texto.slice(Math.max(0, m.index - 40), m.index + 40)}…"`,
      );
  }

  // Links e âncoras internas
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    if (/^(https?:|tel:|mailto:)/.test(href)) continue;
    if (href === '#') {
      erros.push(`${onde} link vazio (#)`);
      continue;
    }
    const [caminho, ancora] = href.split('#');
    if (caminho) {
      const destino = caminho === '/' ? '/' : caminho.replace(/\/$/, '');
      const alvo = paginas.get(destino) ?? null;
      const arquivoEstatico = await existe(join(DIST, destino));
      if (!alvo && !arquivoEstatico) erros.push(`${onde} link quebrado: ${href}`);
      if (ancora && alvo && !new RegExp(`\\sid="${ancora}"`).test(alvo))
        erros.push(`${onde} âncora inexistente: ${href}`);
    } else if (ancora && !ids.has(ancora)) {
      erros.push(`${onde} âncora inexistente: ${href}`);
    }
  }

  // Botões precisam de ação (type explícito)
  for (const [botao] of html.matchAll(/<button(?![^>]*type=)[^>]*>/g))
    erros.push(`${onde} <button> sem type: ${botao}`);

  // WhatsApp: número correto
  for (const [, href] of html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)) {
    if (!href.startsWith('https://wa.me/5527997929358'))
      erros.push(`${onde} link de WhatsApp com número errado: ${href}`);
  }
}

// Sitemap e robots
const sitemapArquivos = arquivos.filter((f) => /sitemap-\d+\.xml$/.test(f));
const sitemap = (await Promise.all(sitemapArquivos.map((f) => readFile(f, 'utf8')))).join('\n');
const urlsSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/',
);
for (const rota of paginas.keys()) {
  if (rota !== '/404' && !urlsSitemap.includes(rota)) erros.push(`sitemap sem ${rota}`);
}
for (const u of urlsSitemap)
  if (!paginas.has(u)) erros.push(`sitemap aponta para página inexistente: ${u}`);
if (urlsSitemap.includes('/equipe') && !paginas.has('/equipe'))
  erros.push('sitemap com /equipe sem profissionais');
const robots = await readFile(join(DIST, 'robots.txt'), 'utf8').catch(() => '');
if (!/Sitemap: https:\/\//.test(robots)) erros.push('robots.txt sem Sitemap absoluto');
if (!(await existe(join(DIST, '_headers')))) erros.push('dist/_headers não foi gerado');

// JavaScript da página inicial
const inicio = paginas.get('/') ?? '';
let jsGzip = 0;
for (const [, src] of inicio.matchAll(/<script[^>]*src="(\/[^"]+\.js)"/g)) {
  jsGzip += gzipSync(await readFile(join(DIST, src))).length;
}
for (const [, , js] of inicio.matchAll(
  /<script(?![^>]*(src=|ld\+json))[^>]*>([\s\S]*?)<\/script>/g,
))
  jsGzip += gzipSync(js).length;
if (jsGzip > 50 * 1024)
  erros.push(
    `JavaScript da página inicial com ${(jsGzip / 1024).toFixed(1)} KB gzip (limite 50 KB)`,
  );

console.log(`Páginas verificadas: ${[...paginas.keys()].join(', ')}`);
console.log(
  `URLs no sitemap: ${urlsSitemap.length} · JS na página inicial: ${(jsGzip / 1024).toFixed(1)} KB gzip`,
);
avisos.forEach((a) => console.log(`aviso: ${a}`));
if (erros.length) {
  erros.forEach((e) => console.log(`ERRO: ${e}`));
  console.log(`\n${erros.length} erro(s).`);
  process.exit(1);
}
console.log('\nTudo certo.');
