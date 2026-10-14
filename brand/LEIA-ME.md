# Mente em Movimento — Identidade Visual (v1.0, out/2026)

Sistema visual construído **ao redor da logo existente**, que permanece intacta.

| Pasta | Conteúdo |
|---|---|
| `01-Logo-Original/` | Arquivo de referência recebido, sem alterações |
| `02-Manual-da-Marca/pdf/` | **Manual de identidade visual (PDF, 23 páginas)**; fonte HTML em `fonte/` |
| `03-Identidade-Visual/` | Logo de trabalho, `paleta/paleta.json`, `tipografia/`, `grafismos/*.svg`, `icones/*.svg` |
| `04-Instagram/` | `templates/` (10 modelos HTML editáveis) e `png/` (18 peças prontas) |
| `05-Materiais-Institucionais/` | `templates/`, `png/`, `pdf/` (cartão, timbrado, crachá, folheto) e `mockups/` |
| `06-Arquivos-Fonte/` | `css/brand.css` (cores, fontes, componentes) e `render.ps1` (exportação) |

## Editar e exportar
1. Abra o HTML do modelo em um editor de texto e substitua os textos entre `[colchetes]`.
2. Exporte (Windows, com Edge ou Chrome instalado):
   ```
   powershell -ExecutionPolicy Bypass -File 06-Arquivos-Fonte\render.ps1
   ```
   Sem argumentos, o script exporta tudo; também aceita arquivos ou pastas específicas.
   O tamanho de cada peça está na tag `<meta name="render">` do próprio HTML.
   Requer internet na exportação (fontes do Google Fonts).

## Pendências com a clínica
- Arquivo original da logo (vetor ou PNG ≥ 3000 px) — indispensável para fachada e impressos grandes.
- Contatos, endereço, perfil do Instagram, nomes/registros/fotos autorizadas dos profissionais.
- Confirmação de convênios e de serviços além das 5 especialidades divulgadas.
