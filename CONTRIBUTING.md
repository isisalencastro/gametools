# Contributing Guide

Obrigado por contribuir com o IBAGameTools! Este guia define o fluxo mínimo para manter o projeto consistente e fácil de revisar.

## Fluxo de branch

Padrão recomendado:

- `main`: branch estável.
- `feature/<slug>`: novas funcionalidades.
- `fix/<slug>`: correções de bugs.
- `docs/<slug>`: alterações somente de documentação.

### Exemplo prático

```bash
git checkout -b feature/calculadora-desconto
```

## Padrão de commit

Adotamos convenção inspirada em Conventional Commits:

- `feat:` nova funcionalidade.
- `fix:` correção de bug.
- `docs:` documentação.
- `refactor:` melhoria interna sem alterar comportamento.
- `chore:` tarefas de manutenção.

Formato:

```text
tipo(escopo-opcional): resumo curto no imperativo
```

### Exemplos práticos

- `docs(readme): ampliar visão de produto e roadmap`
- `feat(jogos): adicionar modo difícil ao quiz rápido`
- `fix(imc): corrigir arredondamento em entradas decimais`

## Fluxo de validação (lint)

O projeto usa um comando agregador e comandos específicos:

```bash
npm run lint        # Executa JS + CSS + HTML em sequência
npm run lint:js     # ESLint para js/**/*.js
npm run lint:css    # Validação estrutural de styles.css
npm run lint:html   # Validação estrutural de index.html
```

### O que cada lint valida

| Script | O que faz | Escopo |
| --- | --- | --- |
| `lint:js` | Executa ESLint em `js/**/*.js` | Todos os arquivos JS na pasta `js/` |
| `lint:css` | Verifica chaves balanceadas e presença do bloco `:root` em `styles.css` | Apenas `styles.css` |
| `lint:html` | Verifica presença de `<!DOCTYPE html>`, `<html`, `<head>` e `<body>` em `index.html` | Apenas `index.html` |

> **Nota**: os scripts de lint atuais são validações estruturais básicas. `lint:css` não usa Stylelint e `lint:html` não cobre páginas em `jogos/` ou `ferramentas/` automaticamente. Novas páginas HTML não entram nessa validação sem alteração manual do script.

## Checklist de Pull Request

Antes de abrir PR, confirme:

- [ ] Branch segue convenção (`feature/`, `fix/` ou `docs/`).
- [ ] Commits têm mensagem clara e padronizada.
- [ ] `npm run lint` executa sem erro.
- [ ] Links internos da feature foram atualizados (catálogo + navegação).
- [ ] SEO básico revisado (title, description, canonical, Open Graph).
- [ ] `sitemap.xml` atualizado ao adicionar nova página pública.
- [ ] Toda URL pública listada em `jogos.html` ou `ferramentas.html` também aparece no `sitemap.xml`.
- [ ] URL declarada no `sitemap.xml` é idêntica ao `canonical` da página correspondente (sem variações de caminho).
- [ ] Mudanças relevantes documentadas no `CHANGELOG.md`.

## Processo sugerido (passo a passo)

1. Sincronize com `main`.
2. Crie uma branch curta e focada.
3. Faça commits pequenos e temáticos.
4. Rode lint local.
5. Atualize docs/checklists quando necessário.
6. Abra PR com contexto, impacto e plano de validação.

### Exemplo de fluxo completo

```bash
git checkout main
git pull origin main
git checkout -b feature/calculadora-desconto
# editar arquivos
npm run lint
git add .
git commit -m "feat(ferramentas): adicionar calculadora de desconto"
git push -u origin feature/calculadora-desconto
```

### Passos ao adicionar uma nova feature

1. Criar página HTML em `jogos/<slug>.html` ou `ferramentas/<slug>.html`.
2. Criar módulo JS em `js/games/<slug>.js` ou `js/tools/<slug>.js` exportando `init*Feature()`.
3. Importar e chamar a função de inicialização em `js/main.js`.
4. Adicionar card/link no catálogo (`jogos.html` ou `ferramentas.html`).
5. Adicionar URL no `sitemap.xml`.
6. Validar metatags com `docs/SEO_CHECKLIST.md`.
7. Rodar `npm run lint`.

## Boas práticas de revisão

- Prefira PRs de até ~300 linhas alteradas quando possível.
- Inclua capturas de tela ao alterar UI visual.
- Em mudanças de conteúdo, destaque impacto de SEO e acessibilidade.

## Dúvidas comuns

- **"Preciso atualizar o changelog para mudança de docs?"**
  - Sim, quando a mudança melhora onboarding, fluxo de contribuição ou governança.
- **"Preciso criar JS separado para toda ferramenta?"**
  - Preferencialmente sim, para manter isolamento e facilitar manutenção.
- **"Onde registro o módulo JS da nova feature?"**
  - Importe e chame a função `init*Feature()` em `js/main.js`. O módulo faz guard check de DOM automaticamente.
