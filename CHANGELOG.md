# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue a ideia de *Keep a Changelog* e versionamento semântico como referência.

## [Unreleased]

### Fixed

- Corrigido nome do projeto na documentação: "GameTools" substituído por "IBAGameTools" em todos os documentos.
- Corrigida descrição dos scripts de lint no `README.md` e `CONTRIBUTING.md`:
  - `lint:css` descrevia uso de Stylelint, mas o script real valida apenas chaves balanceadas e bloco `:root` em `styles.css`.
  - `lint:html` descrevia validação automática de todas as páginas, mas o script real só valida `index.html`.
- Corrigido caminho de arquivos JS no `docs/FEATURE_TEMPLATE.md`: `jogos/<slug>.js` substituído por `js/games/<slug>.js`.
- Corrigidos exemplos no `docs/SEO_CHECKLIST.md` com URLs de produção reais em vez de placeholders genéricos.

### Added

- Tabela de funcionalidades disponíveis no `README.md` com mapeamento entre páginas HTML e módulos JS.
- Seção de módulos JS pendentes de publicação (`guess.js`, `percentage.js`, `temperature.js`) no `README.md`.
- Tabela detalhada dos scripts de lint com limitações conhecidas no `README.md` e `CONTRIBUTING.md`.
- Estrutura de pastas completa no `README.md` incluindo `assets/`, `package.json`, `eslint.config.js`, `CONTRIBUTING.md` e `CHANGELOG.md`.
- Nota sobre imagem `social-card.png` inexistente no `docs/SEO_CHECKLIST.md`.
- Etapa de registro em `js/main.js` adicionada ao `docs/FEATURE_TEMPLATE.md`.
- Seção de passos para adicionar nova feature no `CONTRIBUTING.md`.

### Changed

- `README.md` reestruturado com tabelas de jogos/ferramentas, detalhamento de lint e roadmap atualizado.
- Estrutura de pastas no `README.md` agora inclui comentários explicativos e marca módulos pendentes.
- Onboarding no `README.md` agora inclui URL real do repositório e etapa de registro em `main.js`.
- Roadmap atualizado com item sobre publicação de páginas para módulos pendentes (v1.1) e expansão de lint (v1.2).

## [1.0.0] - 2026-02-23

### Added

- Estrutura inicial do IBAGameTools com páginas estáticas para home, jogos e ferramentas.
- 5 jogos: Teste de Reação, Jogo da Memória, Pedra-Papel-Tesoura, Quiz Rápido, Clique Rápido 10s.
- 6 ferramentas: Calculadora de IMC, Regra de Três, Conversor de Moedas, Idade Exata, Juros, Pomodoro.
- Módulos JS utilitários compartilhados (`catalog.js`, `theme.js`, `utils.js`).
- Arquivos de SEO técnico (`robots.txt` e `sitemap.xml`).
- Scripts de lint para JS, CSS e HTML via NPM.
- Documentação inicial: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/FEATURE_TEMPLATE.md`, `docs/SEO_CHECKLIST.md`.
