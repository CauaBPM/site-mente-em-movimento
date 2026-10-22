# Site — Mente em Movimento · Centro de Saúde Mental e Cognitiva (Vila Velha – ES)

Site institucional estático feito com **Astro 7 + TypeScript**, CSS próprio a partir dos tokens da marca
(`brand/06-Arquivos-Fonte/css/brand.css`) e quase nenhum JavaScript (1,3 KB gzip na página inicial).

- Páginas: `/`, `/a-clinica`, `/especialidades`, `/especialidades/{psiquiatria|neuropsicologia|psicologia|psicopedagogia}`
  (reforço escolar e orientação parental ficam em `/especialidades#reforco-escolar` e `#orientacao-parental`),
  `/atendimento`, `/contato`, `/politica-de-privacidade`, `404` e `/equipe` (só existe quando há profissional confirmado).
- Tudo o que ainda depende da clínica está em **[PENDENCIAS.md](PENDENCIAS.md)**.
- Ações de SEO local fora do código: **[CHECKLIST-SEO-LOCAL.md](CHECKLIST-SEO-LOCAL.md)**.
- Segurança (CSP, cabeçalhos, limites do GitHub Pages, segredos): **[SEGURANCA.md](SEGURANCA.md)**.

---

## 1. Requisitos

- **Node.js 22.12 ou superior** (testado com Node 24) e npm.
- **Windows:** o Astro 7 usa um componente nativo que precisa do
  [Microsoft Visual C++ Redistributable (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe).
  Sem ele, o comando falha com `Cannot find native binding` / `ERR_DLOPEN_FAILED`. Instale uma vez e rode `npm install` de novo.
  (No Linux e no macOS, e no build da Cloudflare, nada é necessário.)
- Para os testes de acessibilidade: Microsoft Edge ou Google Chrome instalado.

## 2. Comandos

```bash
npm install            # instala as dependências
npm run dev            # servidor local em http://localhost:4321
npm run build          # gera o site em dist/
npm run preview        # serve o dist/ localmente

npm run check          # astro check (tipos e templates)
npm run lint           # ESLint
npm run format         # Prettier
npm run verificar      # verifica o dist/: links, H1, títulos, JSON-LD, termos proibidos, sitemap, peso do JS
npm run test:a11y      # axe-core em todas as páginas (360 e 1440 px) + rolagem horizontal + erros de console
npm run test:a11y -- --capturas   # idem, em 360/768/1024/1440 px, salvando capturas em relatorios/
npm run qa             # check + lint + build + verificar
npm run gerar:imagens  # regenera favicon, ícones e imagem de compartilhamento (og-image.png)
```

## 3. Variáveis de ambiente

Copie `.env.example` para `.env` (o `.env` nunca vai para o repositório).

| Variável                                                                                     | Para quê                                                                                               | Onde configurar                       |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| `SITE_URL`                                                                                   | Domínio canônico (canonical, sitemap, Open Graph)                                                      | `.env` e painel da hospedagem         |
| `PUBLIC_FORM_ENABLED`                                                                        | `true` liga o formulário de contato. **Mantenha `false` até a clínica confirmar o e-mail de destino.** | idem                                  |
| `PUBLIC_TURNSTILE_SITE_KEY`                                                                  | Chave pública do Cloudflare Turnstile (obrigatória para o formulário aparecer)                         | idem                                  |
| `CONTACT_EMAIL`, `CONTACT_FROM`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`                    | Envio do formulário (secretos)                                                                         | **somente** no painel, como _secrets_ |
| `PUBLIC_ANALYTICS` + `PUBLIC_PLAUSIBLE_DOMAIN` / `PUBLIC_UMAMI_*` / `PUBLIC_CF_BEACON_TOKEN` | Estatísticas sem cookies (opcional)                                                                    | `.env` e painel                       |
| `PUBLIC_GOOGLE_SITE_VERIFICATION`                                                            | Verificação do Search Console por meta tag (prefira DNS)                                               | idem                                  |

A CSP em `dist/_headers` é gerada a cada build e já inclui Turnstile e a ferramenta de análise **apenas** se estiverem ativados.

## 4. Como editar os textos

Todo o conteúdo editável fica em `src/content/`:

| Arquivo               | Conteúdo                                                                                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clinica.ts`          | Nome, endereço, telefone, horário, Instagram, links do Google, modalidades, itens pendentes (e-mail, CNES, responsáveis técnicos, convênios)                                           |
| `especialidades/*.md` | Uma página por especialidade. O corpo do arquivo é a seção "O que é"; o resto (quando procurar, o que oferece, como funciona, públicos, FAQ, relacionadas, SEO) fica no cabeçalho YAML |
| `faq.ts`              | Perguntas frequentes (`inicio: true` = aparece também na página inicial)                                                                                                               |
| `paginas/*.ts`        | Textos das páginas Início, A clínica, Atendimento, Contato e Política de Privacidade                                                                                                   |
| `equipe/*.md`         | Profissionais                                                                                                                                                                          |
| `servicos.ts`         | Serviços de apoio (reforço escolar, orientação parental): `/especialidades`, página inicial e rodapé                                                                                   |
| `modalidades.ts`      | Modalidades de atendimento (presencial, online, a domicílio): início, `/atendimento` e `/contato`                                                                                      |
| `ilustracoes.ts`      | Imagens ilustrativas de banco (Pexels), com autor, link e licença; exibidas com a legenda "Imagem ilustrativa"                                                                         |
| `fotos.ts`            | Fotos reais do espaço (galeria)                                                                                                                                                        |

Regras de edição:

- `status: "pendente"` → o item **não aparece** (nem página, nem menu, nem sitemap). Use `"confirmado"` só com a informação validada pela clínica.
- Em títulos, `*palavra*` vira itálico de ênfase (use em uma ou duas palavras). Em textos, `**negrito**` e `[link](/caminho)`.
- Título SEO até 60 caracteres e descrição até 155 (o build recusa descrições maiores nas especialidades).
- Linguagem: nada de "cura", "garantia", "resultados comprovados" ou "o melhor". `npm run verificar` acusa esses termos.
- Depois de editar, rode `npm run qa`.

## 5. Como adicionar um profissional

1. Crie `src/content/equipe/nome-sobrenome.md` (use `michelly-silveira.md` como modelo).
2. Preencha `nome`, `profissao`, `tipo` (`psicologo`, `medico` ou `outro`), **`registro`** (ex.: `CRP-16/00000` ou `CRM-ES 00000`),
   **`rqe`** (obrigatório para médico que divulga especialidade — Res. CFM 2.336/2023), `formacao`, `areas` e `publicos`.
3. Foto (opcional): salve em `src/assets/equipe/`, informe `foto: ../../assets/equipe/arquivo.jpg`, `fotoAlt` e **`fotoAutorizada: true`**
   somente com autorização por escrito.
4. Mude `status` para `confirmado`. O build valida: profissional confirmado sem registro (ou médico sem RQE) **não compila**.
5. Com o primeiro profissional confirmado, a página `/equipe` passa a existir, entra no menu, no rodapé e no sitemap. O profissional também
   aparece na página das especialidades listadas em `areas`, com dados estruturados `Person`/`Physician`.

## 6. Como trocar a logo e as fotos

- **Logo:** o site usa um único arquivo, `src/assets/marca/logo.png` (hoje a logo de trabalho de 717 × 450 px com fundo Névoa).
  Quando a clínica enviar o original (PNG ≥ 3000 px), substitua o arquivo **mantendo o nome**. Para SVG, troque o `import` em
  `src/components/Logo.astro`. Depois rode `npm run gerar:imagens` (atualiza `og-image.png` e `public/logo-mente-em-movimento.png`).
  Regras: nunca recortar, recolorir, distorcer ou aplicar efeitos. Largura mínima de 160 px (cabeçalho). Sobre fundo escuro, use `placa`.
- **Favicon:** hoje é um monograma neutro em Petróleo (não derivado da borboleta). Se a clínica quiser um ícone a partir do original, troque em
  `scripts/gerar-imagens.mjs`.
- **Fotos:** veja as instruções em `src/content/fotos.ts`. Só fotos reais, autorizadas, sem pacientes. A galeria aparece sozinha quando houver fotos.
- **Imagens ilustrativas:** ficam em `src/assets/ilustracoes/` e são registradas em `src/content/ilustracoes.ts` (autor, link e licença).
  São cenas de banco de imagens, não a equipe nem pacientes da clínica, e aparecem com a legenda "Imagem ilustrativa".
  Para trocar, salve um JPG com ~1600 px de largura e atualize `alt` e `fonte`; o Astro gera AVIF/WebP automaticamente.

## 7. Como publicar (Cloudflare Pages — recomendado)

1. Envie o projeto para um repositório Git (GitHub ou GitLab).
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
3. Configuração do build: _Framework preset_ **Astro**, _Build command_ `npm run build`, _Output directory_ `dist`,
   variável `NODE_VERSION=22` (ou use o `.nvmrc`).
4. Em **Settings → Variables and Secrets**, cadastre `SITE_URL` e, quando for o caso, as variáveis do formulário e da análise.
5. A pasta `functions/` vira automaticamente a rota `POST /api/contato`. Opcional: crie um binding de _Rate Limiting_ chamado `RATE_LIMITER`.
6. **Domínio:** em _Custom domains_, adicione o domínio raiz (ex.: `menteemmovimentovv.com.br`) e o `www`.
   - Com o DNS na Cloudflare, os registros são criados automaticamente. Fora dela, crie um `CNAME` de `www` para `<projeto>.pages.dev`
     e aponte o domínio raiz conforme as instruções do painel.
   - **www → domínio raiz:** crie uma _Redirect Rule_ (Rules → Redirect Rules): quando _hostname_ for `www.<domínio>`,
     redirecionar (301) para `https://<domínio>${uri.path}`, preservando a query string.
   - **http → https:** SSL/TLS → Edge Certificates → ative _Always Use HTTPS_. O HSTS já é enviado pelo `_headers`.
7. Proteção extra do formulário: Security → WAF → _Rate limiting rule_ para `/api/contato` (ex.: 5 requisições por 10 minutos por IP).

**Netlify ou Vercel:** o site estático funciona igual (`npm run build` → `dist`). O `_headers` é compatível com a Netlify. Na Vercel, converta os
cabeçalhos para `vercel.json`. Nos dois casos, a função do formulário precisa ser adaptada (`netlify/functions` ou `api/`), mantendo a mesma lógica.

## 8. Qualidade e conformidade — o que já é verificado

- Lighthouse mobile (Edge, local): 95–100 em Desempenho e 100 em Acessibilidade, Boas Práticas e SEO em todas as páginas;
  LCP ≤ 2,0 s, CLS ≤ 0,01.
- axe-core sem violações em 360, 768, 1024 e 1440 px, sem rolagem horizontal e sem erros de console.
- Menu móvel em `<dialog>` (foco preso, Esc fecha, `aria-expanded`), FAQ em `<details>`, mapa só após clique, `prefers-reduced-motion`.
- JSON-LD: `MedicalClinic` (sem avaliações próprias), `BreadcrumbList`, `MedicalWebPage`. Valide no
  [Rich Results Test](https://search.google.com/test/rich-results) após publicar.
- Ainda manual: teste com leitor de tela (NVDA ou VoiceOver) e em Safari iOS e Firefox reais.

## 9. Estrutura

```
brand/                  cópia dos arquivos de marca usados (grafismos, ícones, paleta, CSS, logo de trabalho)
functions/api/contato.ts  envio do formulário (Cloudflare Pages Function)
integrations/           gera dist/_headers (CSP com hashes, HSTS etc.)
public/                 fontes woff2 (OFL), favicon, ícones, og-image
scripts/                gerar-imagens, verificar-dist, testar-acessibilidade
src/
  assets/marca/logo.png  ← arquivo ÚNICO da logo
  components/           Header, Footer, WhatsAppFab, Logo, Trajetoria, Arco, MarcadorArea, RedeCognitiva, FAQ,
                        ContactForm, MapConsent, BlocoLocalizacao, CabecalhoPagina, ChamadaWhatsApp, CartaoProfissional, Galeria, Seo, Icone
  content/              todo o texto editável (ver seção 4)
  layouts/BaseLayout.astro
  lib/                  whatsappLink(), validação do formulário, dados estruturados, configuração
  pages/                rotas do site
  scripts/              JS do navegador (revelação, eventos, formulário)
  styles/               tokens.css (marca) e base.css
```
