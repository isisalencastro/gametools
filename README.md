# GameTools

Plataforma web com mini jogos e ferramentas utilitárias, construída em HTML, CSS e JavaScript puro, com foco em simplicidade, performance e deploy estático.

## Visão do produto

O **GameTools** reúne duas frentes no mesmo projeto:

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
2. `jogos.html` e `ferramentas.html` listam os recursos.
3. Usuário acessa uma página específica de jogo/ferramenta.
4. A interação é processada no navegador (sem API externa obrigatória).

### Princípios arquiteturais

- **Progressive enhancement**: conteúdo principal deve funcionar mesmo com JS mínimo.
- **Componentes simples por página**: cada feature encapsula seu comportamento.
- **Reuso utilitário**: helpers em `js/common` para evitar duplicação.
- **SEO first**: metadados, canonical e sitemap mantidos em sincronia.

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
├── index.html
├── jogos.html
├── ferramentas.html
├── styles.css
├── robots.txt
├── sitemap.xml
├── jogos/
│   └── *.html
├── ferramentas/
│   └── *.html
├── js/
│   ├── main.js
│   ├── common/
│   │   ├── catalog.js
│   │   ├── theme.js
│   │   └── utils.js
│   ├── games/
│   │   ├── guess.js
│   │   ├── reaction.js
│   │   ├── rock-paper-scissors.js
│   │   ├── fast-click.js
│   │   ├── quick-quiz.js
│   │   └── memory.js
│   └── tools/
│       ├── imc.js
│       ├── percentage.js
│       ├── temperature.js
│       ├── juros.js
│       ├── idade-exata.js
│       ├── pomodoro.js
│       ├── currency-converter.js
│       └── rule-of-three.js
└── docs/
    ├── FEATURE_TEMPLATE.md
    └── SEO_CHECKLIST.md
```

### Convenções rápidas

- Nova página de jogo: `jogos/<slug>.html` + `js/games/<slug>.js` com `init*Feature`.
- Nova página de ferramenta: `ferramentas/<slug>.html` + `js/tools/<slug>.js` com `init*Feature`.
- Slug sempre em minúsculo, com hífen (`regra-de-tres`, `quiz-rapido`).

## Roadmap

## Concluído

- Base do site estático com home, catálogo e páginas de features.
- Lint de JS, CSS e HTML via NPM scripts.
- Estrutura inicial de SEO técnico (`robots.txt`, `sitemap.xml`).

## Próximos ciclos

### v1.1 — Padronização de conteúdo

- Garantir seção fixa em todas as páginas: descrição, instruções e FAQ curta.
- Padronizar blocos de acessibilidade (`aria-live`, foco visível, labels).
- Revisar links internos entre catálogo e páginas individuais.

### v1.2 — Escalabilidade de features

- Criar checklist de release para novas páginas.
- Definir padrão de telemetria opcional (eventos básicos client-side).
- Melhorar reuso de utilitários JS para validação de formulários.

### v1.3 — Crescimento orgânico

- Expandir conteúdo textual para long-tail SEO.
- Criar páginas de comparação entre ferramentas correlatas.
- Evoluir sitemap com prioridade/frequência por tipo de página.

## Onboarding rápido (exemplo prático)

### 1) Clonar e rodar local

```bash
git clone <repo-url>
cd gametools
npm install
python3 -m http.server 8080
```

Acesse `http://localhost:8080`.

### 2) Criar uma nova ferramenta (exemplo)

Exemplo: **Calculadora de Desconto**.

1. Criar `ferramentas/desconto.html` com título, formulário e área de resultado.
2. Criar `js/tools/desconto.js` com validação dos campos e cálculo.
3. Adicionar link para a nova ferramenta em `ferramentas.html`.
4. Atualizar `sitemap.xml` e validar canonical/metatags.
5. Rodar `npm run lint` antes de abrir PR.

Use o template em `docs/FEATURE_TEMPLATE.md` para não esquecer campos obrigatórios.

## Qualidade e validação

Validação completa:

```bash
npm run lint
```

Validações individuais:

```bash
npm run lint:js
npm run lint:css
npm run lint:html
```

### Escopo automático de lint

- `lint:html` valida todas as páginas HTML da raiz e dos diretórios `jogos/` e `ferramentas/` via glob (`*.html`, `jogos/**/*.html`, `ferramentas/**/*.html`).
- `lint:css` usa Stylelint para validar sintaxe e regras CSS em qualquer arquivo `*.css` do repositório.
- `lint` continua como agregador único de JS + CSS + HTML para uso em CI e pré-PR.

Com isso, novas páginas HTML e novos arquivos CSS entram no lint automaticamente, sem precisar editar scripts manualmente.

## Documentação para contribuidores

- Guia de contribuição: `CONTRIBUTING.md`
- Template de nova feature: `docs/FEATURE_TEMPLATE.md`
- Checklist de SEO: `docs/SEO_CHECKLIST.md`
- Histórico de versões: `CHANGELOG.md`

## Licença

Uso livre para estudo e adaptação.
