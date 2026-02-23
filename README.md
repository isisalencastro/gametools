# IBAGameTools

Plataforma web com mini jogos e ferramentas utilitárias, construída em HTML, CSS e JavaScript puro, com foco em simplicidade, performance e deploy estático.

## Visão do produto

O **IBAGameTools** reúne duas frentes no mesmo projeto:

- **Entretenimento rápido**: jogos curtos para sessões de 1 a 5 minutos.
- **Utilidade diária**: calculadoras e conversores para tarefas comuns.

### Objetivos do produto

- Entregar experiência fluida sem dependência de backend.
- Facilitar indexação orgânica (SEO técnico + conteúdo mínimo por página).
- Manter baixo custo operacional por ser um site estático.
- Permitir que novos contribuidores publiquem novas páginas com baixa curva de aprendizado.

### Público-alvo

- Estudantes que buscam exercícios rápidos e ferramentas simples.
- Usuários mobile que preferem páginas leves.
- Contribuidores iniciantes que desejam praticar HTML/CSS/JS em produção.

## Arquitetura

A arquitetura atual segue o padrão **multi-page app (MPA) estática**:

- Cada jogo/ferramenta tem sua própria página HTML.
- Scripts são organizados por domínio (`js/games`, `js/tools`, `js/common`).
- Estilos centralizados em `styles.css`.
- SEO técnico com `robots.txt` e `sitemap.xml`.

### Fluxo de navegação (alto nível)

1. `index.html` apresenta visão geral e categorias.
2. `jogos.html` e `ferramentas.html` listam os recursos com filtros e busca.
3. Usuário acessa uma página específica de jogo/ferramenta.
4. A interação é processada no navegador (sem API externa obrigatória).

### Princípios arquiteturais

- **Progressive enhancement**: conteúdo principal deve funcionar mesmo com JS mínimo.
- **Componentes simples por página**: cada feature encapsula seu comportamento.
- **Reuso utilitário**: helpers em `js/common` para evitar duplicação.
- **SEO first**: metadados, canonical e sitemap mantidos em sincronia.

## Funcionalidades disponíveis

### Jogos (5 páginas publicadas)

| Jogo | Página | Módulo JS |
| --- | --- | --- |
| Teste de Reação | `jogos/reacao.html` | `js/games/reaction.js` |
| Jogo da Memória | `jogos/memoria.html` | `js/games/memory.js` |
| Pedra-Papel-Tesoura | `jogos/pedra-papel-tesoura.html` | `js/games/rock-paper-scissors.js` |
| Quiz Rápido | `jogos/quiz-rapido.html` | `js/games/quick-quiz.js` |
| Clique Rápido 10s | `jogos/clique-rapido.html` | `js/games/fast-click.js` |

### Ferramentas (6 páginas publicadas)

| Ferramenta | Página | Módulo JS |
| --- | --- | --- |
| Calculadora de IMC | `ferramentas/imc.html` | `js/tools/imc.js` |
| Regra de Três | `ferramentas/regra-de-tres.html` | `js/tools/rule-of-three.js` |
| Conversor de Moedas | `ferramentas/conversor-moedas.html` | `js/tools/currency-converter.js` |
| Calculadora de Idade Exata | `ferramentas/idade-exata.html` | `js/tools/idade-exata.js` |
| Calculadora de Juros | `ferramentas/juros.html` | `js/tools/juros.js` |
| Cronômetro Pomodoro | `ferramentas/pomodoro.html` | `js/tools/pomodoro.js` |

### Módulos JS sem página HTML (pendentes de publicação)

Os seguintes módulos existem em código e são importados por `js/main.js`, mas ainda não possuem página HTML correspondente nem entrada no catálogo:

| Módulo | Arquivo | Descrição |
| --- | --- | --- |
| Jogo de Adivinhação | `js/games/guess.js` | Jogo de adivinhar um número de 1 a 100 com dicas |
| Calculadora de Porcentagem | `js/tools/percentage.js` | Cálculo de porcentagem simples |
| Conversor de Temperatura | `js/tools/temperature.js` | Conversão entre Celsius e Fahrenheit |

Esses módulos já fazem guard check de elementos DOM (retornam silenciosamente quando os elementos não existem na página), então não causam erros em produção.

## Estratégia de links e base path

Este projeto adota **links relativos** como estratégia única de navegação interna.

- Páginas na raiz (`index.html`, `jogos.html`, `ferramentas.html`) usam `./...`.
- Páginas em subpastas (`jogos/*.html`, `ferramentas/*.html`) usam `../...` para voltar à raiz.
- Com isso, a navegação funciona tanto em:
  - raiz de domínio (`https://meudominio.com/`), quanto
  - subcaminho (`https://meudominio.com/gametools/`),
  sem precisar reescrever links internos.

### Configuração por ambiente

| Ambiente | Navegação interna | Canonical/OG |
| --- | --- | --- |
| Local (`http://localhost:8080`) | Funciona automaticamente (links relativos) | Manter apontando para URL pública de produção |
| Produção em subpath (`/gametools`) | Funciona automaticamente (links relativos) | Usar `https://isisalencastro.github.io/gametools/...` |
| Produção na raiz (`/`) | Funciona automaticamente (links relativos) | Atualizar para `https://seu-dominio/...` |

> Regra prática: **não usar links absolutos internos começando com `/gametools/...`**. Use sempre caminhos relativos ao arquivo atual.

### Canonical e navegação local

- Tags `rel="canonical"` permanecem com a URL pública absoluta para SEO.
- Isso **não afeta** a navegação local, pois os links clicáveis do site são relativos.
- Ao trocar domínio/caminho público de deploy:
  1. Atualize os canonicals e metatags sociais (`og:url`, `og:image`, `twitter:image`) da Home.
  2. Atualize `sitemap.xml` para o mesmo domínio/caminho.

## Estrutura de pastas

```text
.
├── index.html                  # Página inicial (home)
├── jogos.html                  # Catálogo de jogos com filtros
├── ferramentas.html            # Catálogo de ferramentas com filtros
├── styles.css                  # Estilos globais (tema claro/escuro)
├── robots.txt                  # Regras para crawlers
├── sitemap.xml                 # Mapa de URLs para indexação
├── package.json                # Scripts NPM (lint)
├── eslint.config.js            # Configuração do ESLint
├── CONTRIBUTING.md             # Guia de contribuição
├── CHANGELOG.md                # Histórico de versões
├── jogos/
│   ├── reacao.html
│   ├── memoria.html
│   ├── pedra-papel-tesoura.html
│   ├── quiz-rapido.html
│   └── clique-rapido.html
├── ferramentas/
│   ├── imc.html
│   ├── idade-exata.html
│   ├── juros.html
│   ├── conversor-moedas.html
│   ├── pomodoro.html
│   └── regra-de-tres.html
├── js/
│   ├── main.js                 # Bootstrap: importa e inicializa todos os módulos
│   ├── common/
│   │   ├── catalog.js          # Filtros e busca nos catálogos
│   │   ├── theme.js            # Alternância de tema claro/escuro
│   │   └── utils.js            # Helpers compartilhados (parsing, formatação, a11y)
│   ├── games/
│   │   ├── reaction.js
│   │   ├── memory.js
│   │   ├── rock-paper-scissors.js
│   │   ├── fast-click.js
│   │   ├── quick-quiz.js
│   │   └── guess.js            # Sem página HTML (pendente)
│   └── tools/
│       ├── imc.js
│       ├── juros.js
│       ├── idade-exata.js
│       ├── pomodoro.js
│       ├── currency-converter.js
│       ├── rule-of-three.js
│       ├── percentage.js       # Sem página HTML (pendente)
│       └── temperature.js      # Sem página HTML (pendente)
├── assets/
│   └── svgs/
│       └── ibagametools_icon_right.svg
└── docs/
    ├── FEATURE_TEMPLATE.md     # Template para novas features
    └── SEO_CHECKLIST.md        # Checklist de SEO por página
```

### Convenções rápidas

- Nova página de jogo: `jogos/<slug>.html` + `js/games/<slug>.js` com `init*Feature`.
- Nova página de ferramenta: `ferramentas/<slug>.html` + `js/tools/<slug>.js` com `init*Feature`.
- Slug sempre em minúsculo, com hífen (`regra-de-tres`, `quiz-rapido`).

## Roadmap

### Concluído

- Base do site estático com home, catálogo e páginas de features.
- Lint de JS, CSS e HTML via NPM scripts.
- Estrutura inicial de SEO técnico (`robots.txt`, `sitemap.xml`).
- Documentação de onboarding, contribuição e templates.

### Próximos ciclos

#### v1.1 — Padronização de conteúdo

- Garantir seção fixa em todas as páginas: descrição, instruções e FAQ curta.
- Padronizar blocos de acessibilidade (`aria-live`, foco visível, labels).
- Revisar links internos entre catálogo e páginas individuais.
- Publicar páginas HTML para os módulos pendentes (adivinhação, porcentagem, temperatura).

#### v1.2 — Escalabilidade de features

- Criar checklist de release para novas páginas.
- Definir padrão de telemetria opcional (eventos básicos client-side).
- Melhorar reuso de utilitários JS para validação de formulários.
- Expandir `lint:html` para validar todas as páginas HTML automaticamente.

#### v1.3 — Crescimento orgânico

- Expandir conteúdo textual para long-tail SEO.
- Criar páginas de comparação entre ferramentas correlatas.
- Evoluir sitemap com prioridade/frequência por tipo de página.

## Onboarding rápido (exemplo prático)

### 1) Clonar e rodar local

```bash
git clone https://github.com/isisalencastro/gametools.git
cd gametools
npm install
python3 -m http.server 8080
```

Acesse `http://localhost:8080`.

### 2) Criar uma nova ferramenta (exemplo)

Exemplo: **Calculadora de Desconto**.

1. Criar `ferramentas/desconto.html` com título, formulário e área de resultado.
2. Criar `js/tools/desconto.js` exportando `initDescontoFeature()`.
3. Importar e chamar `initDescontoFeature()` em `js/main.js`.
4. Adicionar link/card para a nova ferramenta em `ferramentas.html`.
5. Adicionar URL em `sitemap.xml`.
6. Validar canonical e metatags (usar `docs/SEO_CHECKLIST.md`).
7. Rodar `npm run lint` antes de abrir PR.

Use o template em `docs/FEATURE_TEMPLATE.md` para não esquecer campos obrigatórios.

## Qualidade e validação

Validação completa:

```bash
npm run lint
```

Validações individuais:

```bash
npm run lint:js    # ESLint para arquivos em js/**/*.js
npm run lint:css   # Validação estrutural do styles.css (chaves balanceadas e bloco :root)
npm run lint:html  # Validação estrutural do index.html (DOCTYPE, html, head, body)
```

### Detalhes dos scripts de lint

| Script | O que faz | Limitações conhecidas |
| --- | --- | --- |
| `lint:js` | Executa ESLint em `js/**/*.js` | A configuração do `eslint.config.js` atualmente só aplica regras ao arquivo `script.js`; as regras podem não afetar os demais arquivos |
| `lint:css` | Script Node.js que verifica se `styles.css` tem chaves balanceadas e contém bloco `:root` | Não valida regras CSS reais nem usa Stylelint |
| `lint:html` | Script Node.js que verifica presença de `<!DOCTYPE html>`, `<html`, `<head>` e `<body>` em `index.html` | Só valida `index.html`; demais páginas HTML não são verificadas |

> **Nota**: os scripts de lint atuais são validações básicas estruturais. Para validação mais robusta, considere integrar Stylelint para CSS e expandir `lint:html` para cobrir todas as páginas.

## Documentação para contribuidores

- Guia de contribuição: `CONTRIBUTING.md`
- Template de nova feature: `docs/FEATURE_TEMPLATE.md`
- Checklist de SEO: `docs/SEO_CHECKLIST.md`
- Histórico de versões: `CHANGELOG.md`

## Licença

Uso livre para estudo e adaptação.
