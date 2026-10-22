# Segurança do site

Resumo do que protege o site hoje, do que **não** é possível no GitHub Pages e do que depende de ação externa.
Última revisão: 22/10/2026.

## Como o contato funciona

- O site é **estático**. No GitHub Pages não existe backend: o contato é feito **somente por links** para o WhatsApp
  (`https://wa.me/5527997929358`) e para o telefone. As mensagens pré-preenchidas não pedem dados de saúde.
- O **formulário** (`ContactForm.astro` + `functions/api/contato.ts`) está **desativado** e só funciona numa hospedagem
  com funções serverless (Cloudflare Pages). Ele não é renderizado sem `PUBLIC_FORM_ENABLED=true` e chave do Turnstile.
- O site não usa cookies, `localStorage`, `sessionStorage` nem ferramentas de análise (nenhuma está configurada).
- Fontes e imagens são servidas pelo próprio site. O mapa do Google só é carregado depois do clique em "Carregar mapa".

## Proteções por camada

| Proteção                                             | GitHub Pages (hoje)                               | Como é aplicada                                                           |
| ---------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| HTTPS e redirecionamento de HTTP → HTTPS             | **Sim** (cabeçalho HTTP real)                     | Pela própria plataforma (marque "Enforce HTTPS")                          |
| HSTS (`Strict-Transport-Security`)                   | **Sim** (cabeçalho HTTP real, `max-age=31556952`) | Pela própria plataforma                                                   |
| Content Security Policy                              | **Sim, por meta tag**                             | `integrations/cabecalhos-seguranca.mjs`                                   |
| `Referrer-Policy: strict-origin-when-cross-origin`   | **Sim, por meta tag** (`<meta name="referrer">`)  | `integrations/cabecalhos-seguranca.mjs`                                   |
| Clickjacking (`frame-ancestors` / `X-Frame-Options`) | **Não** — só funcionam como cabeçalho HTTP        | Exige hospedagem/CDN que permita cabeçalhos (ver abaixo)                  |
| `X-Content-Type-Options: nosniff`                    | **Não**                                           | Idem                                                                      |
| `Permissions-Policy`, `Cross-Origin-Opener-Policy`   | **Não**                                           | Idem                                                                      |
| Todas as anteriores como cabeçalho HTTP              | —                                                 | `dist/_headers` (Cloudflare Pages / Netlify), gerado fora do GitHub Pages |

A CSP por meta tag tem limites conhecidos: o navegador **ignora** `frame-ancestors`, `report-uri`/`report-to` e
`sandbox` em meta tag, por isso elas só existem no `_headers`. A meta tag é inserida logo após `<head>`, antes de
qualquer script, em todas as páginas (inclusive a 404).

### A política (CSP)

- `script-src 'self'` + hash SHA-256 de cada script inline. **Sem `'unsafe-inline'` e sem `'unsafe-eval'` para scripts.**
  Os hashes são recalculados a cada build. `script-src-attr 'none'` bloqueia atributos `onclick=` etc.
- `style-src 'self' 'unsafe-inline'`: necessário porque o Astro gera `<style>` inline e atributos `style=""`. O risco
  é baixo, porque scripts continuam restritos.
- `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
  `form-action 'self'`, `upgrade-insecure-requests`.
- `frame-src https://www.google.com https://maps.google.com`: só para o mapa carregado após o clique.
- Domínios extras só entram se o recurso for ativado por variável de ambiente (Turnstile, Plausible, Umami, Cloudflare).

## Verificações automáticas

- `npm run verificar`: falha se alguma página estiver sem CSP, tiver CSP depois de um `<script>`, `'unsafe-eval'`,
  script inline sem hash, links `javascript:`/`data:`/`http:`, `target="_blank"` sem `noopener`, WhatsApp com número
  diferente do oficial, e-mail exibido sem confirmação, source maps ou arquivos `.env`/chaves publicados.
- No GitHub Actions, o site é verificado **antes** de publicar (build padrão completo + regras de segurança no build da prévia).
- `npm run test:a11y`: acessibilidade com axe-core (usa `bypassCSP` só no navegador de teste, para injetar o axe).

## GitHub Actions

- Actions fixadas pelo **SHA do commit** (tag no comentário). Para atualizar, troque SHA e comentário juntos.
- Permissões mínimas: `permissions: {}` no topo; o build só lê o repositório (`contents: read`, sem credenciais
  persistidas no checkout); só o deploy tem `pages: write` e `id-token: write`.
- `npm ci --ignore-scripts`: scripts de instalação das dependências não são executados.

## Segredos

- Nenhum segredo (chave de API, token, senha, chave privada, `.env`) foi encontrado no código nem no histórico do Git
  na revisão de 22/10/2026.
- Os segredos do formulário (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM`) devem ficar
  **apenas** no painel da hospedagem. Nunca no repositório, que é público.
- Se um segredo for versionado por engano: **revogue/rotacione a credencial imediatamente**. Apagar o arquivo num commit
  novo não o remove do histórico; a limpeza exige reescrever o histórico (`git filter-repo`) e forçar o push.

## O que depende de ação fora do código

1. **Cabeçalhos HTTP completos** (anti-clickjacking, `nosniff`, `Permissions-Policy`): exigem publicar no
   **Cloudflare Pages** (o `_headers` já é gerado) ou colocar o GitHub Pages atrás de uma CDN/proxy que injete cabeçalhos.
2. **Formulário de contato**: só com hospedagem que execute `functions/api/contato.ts`, com os segredos no painel,
   Turnstile e uma regra de limitação de requisições (Rate Limiting) do Cloudflare. A validação no navegador é só
   conveniência; a validação que vale é a do servidor.
3. No GitHub: manter "Enforce HTTPS" ativo, ativar **Dependabot alerts**, **secret scanning** e **push protection**
   (Settings → Code security) e proteger a branch `main`.

## Atualização de dependências

`npm audit` sem vulnerabilidades em 22/10/2026. Há atualizações menores disponíveis (ex.: `astro` 7.3.8 → 7.4.2) que não
corrigem vulnerabilidades conhecidas; atualize com `npm update`, rode `npm run qa` e revise antes de publicar.
