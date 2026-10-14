// Gera os arquivos de imagem estáticos em public/:
//   - og-image.png (1200 × 630): logo intacta sobre Névoa + grafismos da marca
//   - favicon.svg / favicon.ico / apple-touch-icon.png / icon-192.png / icon-512.png:
//     monograma neutro em Petróleo (NÃO derivado do desenho da borboleta)
//   - logo-mente-em-movimento.png: cópia exata da logo (usada nos dados estruturados)
// Rode de novo quando a clínica enviar a logo original:  npm run gerar:imagens
import sharp from 'sharp';
import { copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const raiz = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const LOGO = raiz('src/assets/marca/logo.png');

// ---------- Monograma (favicon) ----------
const monograma = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#1F6078"/>
  <path d="M8 23V13.5a4 4 0 0 1 8 0V23M16 13.5a4 4 0 0 1 8 0V23" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

await writeFile(raiz('public/favicon.svg'), monograma);

const png = (tamanho) =>
  sharp(Buffer.from(monograma), { density: 72 * (tamanho / 32) * 2 })
    .resize(tamanho, tamanho)
    .png()
    .toBuffer();

// apple-touch-icon com respiro (o iOS aplica as próprias bordas)
const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#1F6078"/>
  <path d="M50 124V78a20 20 0 0 1 40 0v46M90 78a20 20 0 0 1 40 0v46" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
await sharp(Buffer.from(touch)).resize(180, 180).png().toFile(raiz('public/apple-touch-icon.png'));
await sharp(Buffer.from(touch), { density: 300 })
  .resize(192, 192)
  .png()
  .toFile(raiz('public/icon-192.png'));
await sharp(Buffer.from(touch), { density: 600 })
  .resize(512, 512)
  .png()
  .toFile(raiz('public/icon-512.png'));

// favicon.ico com um PNG de 32 px embutido (formato ICO aceita PNG)
const png32 = await png(32);
const cabecalho = Buffer.alloc(6);
cabecalho.writeUInt16LE(0, 0);
cabecalho.writeUInt16LE(1, 2);
cabecalho.writeUInt16LE(1, 4);
const entrada = Buffer.alloc(16);
entrada.writeUInt8(32, 0);
entrada.writeUInt8(32, 1);
entrada.writeUInt8(0, 2);
entrada.writeUInt8(0, 3);
entrada.writeUInt16LE(1, 4);
entrada.writeUInt16LE(32, 6);
entrada.writeUInt32LE(png32.length, 8);
entrada.writeUInt32LE(22, 12);
await writeFile(raiz('public/favicon.ico'), Buffer.concat([cabecalho, entrada, png32]));

// ---------- Imagem de compartilhamento (Open Graph) ----------
const W = 1200;
const H = 630;
const LOGO_W = 560; // abaixo da largura original (717 px): só reduz, sem ampliar
const meta = await sharp(LOGO).metadata();
const LOGO_H = Math.round((LOGO_W * meta.height) / meta.width);
const logoX = Math.round((W - LOGO_W) / 2);
const logoY = 70;

const fundo = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#EEEFF1"/>
  <circle cx="1130" cy="760" r="330" fill="#D6ECE9"/>
  <g transform="translate(0 ${logoY + LOGO_H + 24}) scale(${W / 1080})">
    <path d="M-40 190 C180 190 260 70 460 80 S760 200 900 150 S1040 50 1120 60" fill="none" stroke="#249C90" stroke-width="3" stroke-linecap="round" transform="scale(1 0.55)"/>
  </g>
  <circle cx="${(460 * W) / 1080}" cy="${logoY + LOGO_H + 24 + (80 * 0.55 * W) / 1080}" r="11" fill="#249C90"/>
  <circle cx="${(900 * W) / 1080}" cy="${logoY + LOGO_H + 24 + (150 * 0.55 * W) / 1080}" r="14" fill="#FFFFFF" stroke="#1F6078" stroke-width="3"/>
</svg>`;

const logoRedimensionada = await sharp(LOGO).resize(LOGO_W).png().toBuffer();
await sharp(Buffer.from(fundo))
  .composite([{ input: logoRedimensionada, left: logoX, top: logoY }])
  .png({ compressionLevel: 9 })
  .toFile(raiz('public/og-image.png'));

// ---------- Logo para dados estruturados (cópia byte a byte) ----------
await copyFile(LOGO, raiz('public/logo-mente-em-movimento.png'));

// ---------- Manifesto ----------
await writeFile(
  raiz('public/site.webmanifest'),
  JSON.stringify(
    {
      name: 'Mente em Movimento – Vila Velha, ES',
      short_name: 'Mente em Movimento',
      lang: 'pt-BR',
      start_url: '/',
      display: 'browser',
      background_color: '#EEEFF1',
      theme_color: '#1F6078',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ) + '\n',
);

console.log('Imagens geradas em public/.');
