# Auditoria de segurança — 10/11/2026

**Projeto:** `CauaBPM/site-mente-em-movimento`  
**Referência auditada:** `main` em `55287846e5f564851fc78469d368f5b611654711`; correções propostas na PR #1.  
**Método:** inspeção estática do código-fonte e configuração pública, API de metadados de commits/workflows, revisão de dependências declaradas e advisories públicos.  
**Limitações:** não foi possível executar o projeto localmente nem executar scanner de dependências em ambiente isolado (sem rede/instalação). A integração não autoriza a leitura de alertas privados de Dependabot, secret scanning e code scanning, nem da proteção da branch. Não houve pentest, testes de carga, auditoria forense integral de todos os blobs históricos ou inspeção autenticada do ambiente Cloudflare/DNS.

## Visão geral

O site é estático no GitHub Pages. Não há autenticação, banco de dados ou backend ativo nessa hospedagem. O endpoint `functions/api/contato.ts` é destinado ao Cloudflare Pages e o formulário está **desativado por padrão**. O workflow de publicação existente possui permissões mínimas, actions fixadas por SHA e `npm ci --ignore-scripts`. Há CSP por meta tag (para GH Pages) e `_headers` para hospedagens compatíveis.

Não foi identificada, nos arquivos inspecionados, chave de API ou senha em texto claro. Isso **não equivale** a uma varredura integral do histórico ou a ausência comprovada de segredos.

## Resultados da primeira execução real de CI (10/11/2026)

A execução do workflow na PR #1 concluiu **instalação, verificação de tipos, lint, build e verificação da distribuição com sucesso**, mas **reprovou** em `npm audit --audit-level=high`.

O comando identificou **12 vulnerabilidades (1 alta e 11 moderadas)** na árvore de dependências instalada pelo lockfile: `undici` (alta: vários advisories, incluindo GHSA-4qv8-2p9j-2685), `fast-uri` (moderadas) e `minimatch` (moderada; também transitiva por ESLint/typescript-eslint). O npm reportou correção disponível via `npm audit fix` para `undici` e `fast-uri`; para alguns caminhos de `minimatch` sugeriu `--force` com mudança potencialmente incompatível em ESLint. **Não executar `--force` sem revisão técnica e testes.** Essas dependências podem estar restritas a tooling/build; a presença na árvore não prova exploração pelo site estático publicado. Ver execução: https://github.com/CauaBPM/site-mente-em-movimento/actions/runs/42840320134.

**Próxima correção prioritária:** atualizar lockfile e versões compatíveis para remover o alerta alto de `undici`, executar `npm ci`, `npm run qa` e `npm audit`, e conferir se `minimatch` requer atualização coordenada das ferramentas de lint. Manter o check de auditoria bloqueante até resolver ou justificar formalmente um risco residual.

## Achados priorizados

| ID | Severidade | Achado | Evidência e efeito | Ação |
| --- | --- | --- | --- | --- |
| S-00 | **Alta (dependências)** | `npm audit` identificou vulnerabilidades atuais no lockfile (12 alertas, incluindo 1 alto em `undici`). | CI de 10/11/2026, execução 42840320134. O QA passou e o passo de audit falhou. | Atualizar dependências e lockfile sem `--force` cego; validar nova execução e separar dependências de build das de produção. |
| S-01 | **Alta, condicional** | Formulário capta `area` (Psiquiatria, Psicologia etc.) e `paraQuem`; a política diz que não coleta informações de saúde. | `src/lib/formulario.ts`, `src/components/ContactForm.astro`, `src/content/paginas/privacidade.ts`. Mesmo sem campo livre, a especialidade solicitada pode revelar dado pessoal sensível ou inferências de saúde. **Formulário atualmente desligado.** | Antes de ativar, minimizar campos (preferível nome, contato e período), revisar base legal, transparência, retenção de e-mails, fornecedores e LGPD com responsável jurídico. Não habilitar sem essa revisão. |
| S-02 | **Média, condicional** | Rate limiting em memória é por instância e mantém IPs sem limpeza periódica/cota de entradas. | `functions/api/contato.ts`: `Map` global. Ataques distribuídos podem escapar do controle; diferentes IPs podem aumentar uso de memória. **API não executa no GH Pages.** | Exigir binding `RATE_LIMITER` ou regra gerenciada na hospedagem antes de ativar formulário; remover ou limitar o fallback em memória. |
| S-03 | **Média** | GitHub Pages não permite aplicar alguns cabeçalhos HTTP de segurança customizados. | `integrations/cabecalhos-seguranca.mjs`; `SEGURANCA.md`. A CSP via meta não suporta `frame-ancestors`; sem cabeçalho anti-clickjacking customizado. | Para domínio definitivo, usar Cloudflare Pages/CDN com headers HTTP e conferir resposta real via navegador/curl. |
| S-04 | **Média** | Não foi possível confirmar proteção de `main`, secret scanning/push protection e alertas do repositório. | Consulta à API de branch protection retornou 403; alertas privados inacessíveis pela integração. | No GitHub Settings, ativar proteção por regras, revisão obrigatória, checks, Dependabot alerts, secret scanning e push protection se disponíveis. |
| S-05 | **Média** | Faltavam checks dedicados a PRs e atualização programada de dependências. | Workflow anterior disparava apenas em `main`; não existia `.github/dependabot.yml`. | **Proposto nesta PR:** novo CI `security-qa.yml` com `npm run qa` e `npm audit --audit-level=high`; Dependabot semanal. Conferir execução e ajustes necessários antes de merge. |
| S-06 | **Baixa/média, condicional** | Corpo de POST era inteiramente carregado antes de validar o limite de 10 KB; `Origin` ausente era aceito. | `functions/api/contato.ts` em `main`. | **Corrigido na PR #1:** leitura limitada durante o streaming e origem HTTPS estrita. Testar a função Cloudflare antes de ativar formulário. |
| S-07 | **Média, governança** | Política de privacidade é explicitamente descrita como rascunho pendente de parecer jurídico. | `src/content/paginas/privacidade.ts` e `src/pages/politica-de-privacidade.astro`. | Validar finalidade, dados coletados, fornecedores, prazo de retenção e exercício dos direitos. |
| S-08 | **Informativo** | Arquivos de pendências operacionais, textos de aprovação e dados institucionais são públicos. | `PENDENCIAS.md`, `CHECKLIST-SEO-LOCAL.md`, `src/content/`, `README.md`. | Revisar cada item antes de incluir dados privados. Tornar o repositório privado **não apaga o histórico nem garante ocultar a publicação**; avaliar requisitos do GitHub Pages primeiro. |
| S-09 | **Informativo** | Dependências declaradas incluem `astro ^7.3.8`. | `package.json`. Advisories públicos de outubro de 2026 afetavam versões anteriores (por exemplo versões abaixo de 7.3.2/7.3.3); isso não prova vulnerabilidade no lockfile. | Executar `npm ci`, `npm audit`, conferir versões efetivamente resolvidas no lockfile; atualizar somente com testes. |

## Controles positivos identificados

- `.gitignore` exclui `.env`, `.dev.vars`, chaves privadas e diretórios de build; `.env.example` contém placeholders, não chaves secretas.
- CSP gerada com hashes SHA-256 para scripts inline, sem `unsafe-eval` em `script-src`.
- Injeção de JSON-LD mitiga fechamento de tag `</script>` ao escapar `<`; a função `inline()` escapa HTML e restringe esquemas de links.
- O formulário faz normalização/validação no servidor, escape de HTML em e-mails, Turnstile e não registra os dados do formulário nos logs.
- O mapa do Google é carregado somente após ação expressa do visitante.
- O build executa verificação dos arquivos publicados e detecta alguns artefatos sensíveis.
- O workflow de deploy usa actions fixadas por SHA, permissões reduzidas por job e credenciais não persistidas.

## Checklist para concluir a auditoria operacional

- [x] Conferir primeira execução do workflow: QA passou; npm audit encontrou 12 vulnerabilidades (1 alta, 11 moderadas).
- [ ] Corrigir dependências, atualizar lockfile e obter `npm audit --audit-level=high` aprovado.
- [ ] Executar secret scanning com histórico completo (por exemplo gitleaks/trufflehog em clone completo) e revisar alertas nativos do GitHub.
- [ ] Verificar no GitHub as regras da branch principal, permissões de terceiros, segredos de Actions, Dependabot e proteção contra push de segredos.
- [ ] Conferir domínio, DNS, HTTPS, CSP real, HSTS e headers do **site definitivo**, não só da prévia no GitHub Pages.
- [ ] Se optar por Cloudflare Pages: validar `_headers` e medir se o valor de CSP respeita os limites da hospedagem; headers de Pages Functions devem ser enviados na própria função.
- [ ] Se ativar formulário: revisão LGPD, rate limiting gerenciado, teste de Turnstile, origem, tipos de conteúdo, limites de corpo, e-mail e tratamento de falhas.
- [ ] Realizar testes dinâmicos em ambiente de homologação com autorização, sem usar dados de pacientes.
- [ ] Validar registros dos profissionais e autorização de uso de conteúdo/imagens antes de publicação.

## Estado das mudanças

A PR #1 é **draft** e não altera a `main` até revisão e merge. As correções propostas reduzem riscos específicos, mas **não constituem certificação de segurança**. Não registrar a auditoria como `100% concluída` enquanto existirem verificações externas e testes pendentes.
