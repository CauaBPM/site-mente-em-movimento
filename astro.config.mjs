// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import cabecalhosSeguranca from './integrations/cabecalhos-seguranca.mjs';
import subcaminho from './integrations/subcaminho.mjs';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

/**
 * Domínio canônico do site (sem barra no final).
 * PENDENTE: confirmar o domínio com a clínica (ver PENDENCIAS.md).
 */
const SITE_URL = (env.SITE_URL || 'https://menteemmovimentovv.com.br').replace(/\/$/, '');

/**
 * Subcaminho de publicação (ex.: "/site-mente-em-movimento" no GitHub Pages).
 * Vazio no domínio definitivo.
 */
const BASE_PATH = (env.BASE_PATH || '').replace(/\/$/, '');

export default defineConfig({
  site: SITE_URL,
  ...(BASE_PATH ? { base: BASE_PATH } : {}),
  trailingSlash: 'never',
  build: {
    // Gera /a-clinica.html → servido como /a-clinica (sem barra final)
    format: 'file',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    cabecalhosSeguranca({ env }),
    subcaminho({ base: BASE_PATH, site: SITE_URL, previa: env.PUBLIC_PREVIEW === 'true' }),
  ],
});
