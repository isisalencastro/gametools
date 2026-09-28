# Jogos IBA

Plataforma web de mini jogos, construída em HTML, CSS e JavaScript puro, com foco em simplicidade, performance e
deploy estático.

## Visão do produto

O **Jogos IBA** é um catálogo de jogos curtos, para sessões de 1 a 5 minutos: teste de reação, memória,
pedra-papel-tesoura, quiz, clique rápido e desafio de depuração.

O produto é somente jogos. O histórico do que saiu do escopo fica no `CHANGELOG.md`.

### Objetivos do produto

- Entregar experiência fluida sem dependência de backend.
- Facilitar indexação orgânica (SEO técnico + conteúdo mínimo por página).
- Manter baixo custo operacional por ser um site estático.
- Permitir que novos contribuidores publiquem novos jogos com baixa curva de aprendizado.

### Público-alvo

- Pessoas que querem um jogo rápido no navegador, sem instalar nada.
- Usuários mobile que preferem páginas leves.
- Contribuidores iniciantes que desejam praticar HTML/CSS/JS em produção.

## Arquitetura

A arquitetura atual segue o padrão **multi-page app (MPA) estática**:

- Cada jogo tem sua própria página HTML.
- Scripts são organizados por domínio (`js/games`, `js/common`).
- Estilos centralizados em `styles.css`, com tokens de cor em `:root`.
- SEO técnico com `robots.txt` e `sitemap.xml`.

### Fluxo de navegação (alto nível)

1. `index.html` apresenta a visão geral e três jogos em destaque.
2. `jogos.html` lista todos os jogos com filtro por categoria e busca.
3. Usuário acessa a página do jogo escolhido.
4. A interação é processada no navegador (sem API externa obrigatória).

### Princípios arquiteturais

- **Progressive enhancement**: conteúdo principal deve funcionar mesmo com JS mínimo.
- **Componentes simples por página**: cada jogo encapsula seu comportamento.
- **Reuso utilitário**: helpers em `js/common` para evitar duplicação.
- **SEO first**: metadados, canonical e sitemap mantidos em sincronia.

## Funcionalidades disponíveis

### Jogos (6 páginas publicadas)

| Jogo | Página | Módulo JS |
| --- | --- | --- |
| Teste de Reação | `jogos/reacao.html` | `js/games/reaction.js` |
| Jogo da Memória | `jogos/memoria.html` | `js/games/memory.js` |
| Pedra-Papel-Tesoura | `jogos/pedra-papel-tesoura.html` | `js/games/rock-paper-scissors.js` |
| Quiz Rápido | `jogos/quiz-rapido.html` | `js/games/quick-quiz.js` |
| Clique Rápido 10s | `jogos/clique-rapido.html` | `js/games/fast-click.js` |
| Debug Challenge | `jogos/debug-challenge.html` | `js/games/debug-challenge.js` |

### Módulos JS sem página HTML (pendente de publicação)

| Módulo | Arquivo | Descrição |
| --- | --- | --- |
| Jogo de Adivinhação | `js/games/guess.js` | Jogo de adivinhar um número de 1 a 100 com dicas |

O módulo faz guard check de elementos DOM (retorna silenciosamente quando os elementos não existem na página),
então não causa erro em produção.

## Identidade visual

Os tokens canônicos da IBA ficam no bloco `:root` de `styles.css`:

| Papel | Token | Valor |
| --- | --- | --- |
| Fundo padrão | `--color-surface-page` | `#FFFFFF` |
| Superfície | `--color-surface` | `#F7F9FC` |
| Superfície alternada | `--color-surface-alt` | `#EEF2F8` |
| Texto principal | `--color-ink` | `#101828` |
| Texto secundário | `--color-ink-muted` | `#4A5568` |
| Texto terciário | `--color-ink-soft` | `#667085` |
| Azul da marca | `--color-brand` | `#185CB6` |
| Azul escuro | `--color-brand-dark` | `#124C97` |
| Azul suave | `--color-brand-soft` | `#F2F6FC` |
| Azul suave 2 | `--color-brand-soft-alt` | `#E8F0FB` |
| Laranja (só em ação) | `--color-accent` | `#FFBD59` |
| Laranja escuro | `--color-accent-dark` | `#F0A62A` |

Regras da pele:

- Fundo branco, sem gradiente decorativo, sem vidro fosco.
- Superfície clara com borda fina de 1px e sombra discreta. Sem contorno preto e sem sombra dura.
- Laranja somente em botão de ação, no máximo dois destaques por tela.
- Fontes Archivo (títulos) e Inter (corpo), servidas localmente de `assets/fonts/` com `font-display: swap`.
  Mono do sistema no código.
- Raios de 6px, 8px e 12px.
- Sem emoji em título, rótulo, botão ou meta.
- Tema escuro é opção do visitante, nunca padrão. Quem chega vê claro.

## Estratégia de links e base path

Este projeto adota **links relativos** como estratégia única de navegação interna.

- Páginas na raiz (`index.html`, `jogos.html`) usam `./...`.
- Páginas em subpastas (`jogos/*.html`) usam `../...` para voltar à raiz.
- Com isso, a navegação funciona tanto em:
  - raiz de domínio (`https://jogos.ibaestudio.com/`), quanto
  - subcaminho (`https://isisalencastro.github.io/gametools/`),
  sem precisar reescrever links internos.

### Configuração por ambiente

| Ambiente | Navegação interna | Canonical/OG |
| --- | --- | --- |
| Local (`http://localhost:8080`) | Funciona automaticamente (links relativos) | Manter apontando para URL pública de produção |
| GitHub Pages em subpath (`/gametools`) | Funciona automaticamente (links relativos) | Usar `https://isisalencastro.github.io/gametools/...` |
| Domínio próprio na raiz (`/`) | Funciona automaticamente (links relativos) | Atualizar para `https://jogos.ibaestudio.com/...` |

> Regra prática: **não usar links absolutos internos começando com `/gametools/...`**. Use sempre caminhos relativos
> ao arquivo atual.

### Canonical e navegação local

- Tags `rel="canonical"` permanecem com a URL pública absoluta para SEO.
- Isso **não afeta** a navegação local, pois os links clicáveis do site são relativos.
- Ao trocar domínio/caminho público de deploy:
  1. Atualize os canonicals e metatags sociais (`og:url`, `og:image`, `twitter:image`) de todas as páginas.
  2. Atualize `sitemap.xml` e `robots.txt` para o mesmo domínio/caminho.

## Estrutura de pastas

```text
.
├── index.html                  # Página inicial (home)
├── jogos.html                  # Catálogo de jogos com filtros
├── styles.css                  # Estilos globais (tema claro/escuro)
├── robots.txt                  # Regras para crawlers
├── sitemap.xml                 # Mapa de URLs para indexação
├── package.json                # Scripts NPM (lint)
├── eslint.config.js            # Configuração do ESLint
├── .stylelintrc.json           # Configuração de referência do Stylelint
├── .htmlhintrc                 # Configuração de referência do HTMLHint
├── CONTRIBUTING.md             # Guia de contribuição
├── CHANGELOG.md                # Histórico de versões
├── jogos/
│   ├── reacao.html
│   ├── memoria.html
│   ├── pedra-papel-tesoura.html
│   ├── quiz-rapido.html
│   ├── clique-rapido.html
│   └── debug-challenge.html
├── js/
│   ├── main.js                 # Bootstrap: importa e inicializa todos os módulos
│   ├── common/
│   │   ├── catalog.js          # Filtros e busca do catálogo
│   │   ├── confetti.js         # Confete dos jogos (carrega canvas-confetti sob demanda)
│   │   ├── mobile-menu.js      # Menu hambúrguer no mobile
│   │   ├── theme.js            # Alternância de tema claro/escuro
│   │   └── utils.js            # Helpers compartilhados (parsing, formatação, a11y)
│   └── games/
│       ├── reaction.js
│       ├── memory.js
│       ├── rock-paper-scissors.js
│       ├── fast-click.js
│       ├── quick-quiz.js
│       ├── debug-challenge.js
│       └── guess.js            # Sem página HTML (pendente)
├── assets/
│   ├── fonts/                  # Archivo e Inter (woff2, servidas localmente)
│   ├── img/                    # Marca do estúdio usada no rodapé
│   └── svgs/
│       └── ibagametools_icon_right.svg
└── docs/
    ├── FEATURE_TEMPLATE.md     # Template para novos jogos
    └── SEO_CHECKLIST.md        # Checklist de SEO por página
```

### Convenções rápidas

- Nova página de jogo: `jogos/<slug>.html` + `js/games/<slug>.js` com `init*Feature`.
- Slug sempre em minúsculo, com hífen (`quiz-rapido`, `debug-challenge`).

## Roadmap

### Concluído

- Base do site estático com home, catálogo e páginas de jogos.
- Lint de JS, CSS e HTML via NPM scripts.
- Estrutura inicial de SEO técnico (`robots.txt`, `sitemap.xml`).
- Documentação de onboarding, contribuição e templates.
- Remoção do escopo utilitário: produto somente de jogos.
- Re-skin completo na identidade visual da IBA, com tema escuro opcional.

### Próximos ciclos

#### v1.1 — Padronização de conteúdo

- Garantir seção fixa em todas as páginas: descrição, instruções e FAQ curta.
- Padronizar blocos de acessibilidade (`aria-live`, foco visível, labels).
- Revisar links internos entre catálogo e páginas individuais.
- Publicar página HTML para o módulo pendente (`guess.js`).

#### v1.2 — Escalabilidade de features

- Criar checklist de release para novas páginas.
- Definir padrão de telemetria opcional (eventos básicos client-side).
- Melhorar reuso de utilitários JS para validação de formulários.
- Expandir `lint:html` para validar todas as páginas HTML automaticamente.

#### v1.3 — Crescimento orgânico

- Expandir conteúdo textual para long-tail SEO.
- Criar páginas de categoria por tipo de jogo.
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

### 2) Criar um novo jogo (exemplo)

Exemplo: **Jogo da Velha**.

1. Criar `jogos/jogo-da-velha.html` com título, tabuleiro e área de resultado.
2. Criar `js/games/jogo-da-velha.js` exportando `initJogoDaVelhaFeature()`.
3. Importar e chamar `initJogoDaVelhaFeature()` em `js/main.js`.
4. Adicionar card para o novo jogo em `jogos.html` (e, se for destaque, na home).
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
| `lint:js` | Executa ESLint em `js/**/*.js`, com `no-unused-vars` | Não valida HTML nem CSS |
| `lint:css` | Script Node.js que verifica se `styles.css` tem chaves balanceadas e contém bloco `:root` | Não valida regras CSS reais nem usa Stylelint |
| `lint:html` | Script Node.js que verifica presença de `<!DOCTYPE html>`, `<html`, `<head>` e `<body>` em `index.html` | Só valida `index.html`; demais páginas HTML não são verificadas |

> **Nota**: os scripts de lint atuais são validações básicas estruturais. Para validação mais robusta, considere
> integrar Stylelint para CSS e expandir `lint:html` para cobrir todas as páginas.

## Documentação para contribuidores

- Guia de contribuição: `CONTRIBUTING.md`
- Template de novo jogo: `docs/FEATURE_TEMPLATE.md`
- Checklist de SEO: `docs/SEO_CHECKLIST.md`
- Histórico de versões: `CHANGELOG.md`

## Licença

Uso livre para estudo e adaptação.
