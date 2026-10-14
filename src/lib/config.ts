/** Funcionalidades controladas por variáveis de ambiente (ver .env.example). */
export const config = {
  formularioAtivo:
    import.meta.env.PUBLIC_FORM_ENABLED === 'true' &&
    Boolean(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY),
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '',
  analytics: (import.meta.env.PUBLIC_ANALYTICS ?? '') as '' | 'plausible' | 'umami' | 'cloudflare',
  plausibleDominio: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? '',
  umamiId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID ?? '',
  umamiSrc: import.meta.env.PUBLIC_UMAMI_SRC ?? '',
  cfBeaconToken: import.meta.env.PUBLIC_CF_BEACON_TOKEN ?? '',
  googleVerificacao: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
};
