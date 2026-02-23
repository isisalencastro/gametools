# Contributing Guide

Obrigado por contribuir com o GameTools! Este guia define o fluxo mínimo para manter o projeto consistente e fácil de revisar.

## Fluxo de branch

Padrão recomendado:

- `main`: branch estável.
- `feature/<slug>`: novas funcionalidades.
- `fix/<slug>`: correções de bugs.
- `docs/<slug>`: alterações somente de documentação.

### Exemplo prático

```bash
git checkout -b docs/expandir-documentacao-onboarding
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
npm run lint
npm run lint:js
npm run lint:css
npm run lint:html
```

Regras atuais:

- `lint` executa JS + CSS + HTML em sequência.
- `lint:html` cobre automaticamente páginas na raiz e em `jogos/` e `ferramentas/` (sem necessidade de ajustar script quando novas páginas forem criadas).
- `lint:css` usa Stylelint para validar regras CSS reais (não apenas balanceamento de chaves).

## Checklist de Pull Request

Antes de abrir PR, confirme:

- [ ] Branch segue convenção (`feature/`, `fix/` ou `docs/`).
- [ ] Commits têm mensagem clara e padronizada.
- [ ] `npm run lint` executa sem erro.
- [ ] Links internos da feature foram atualizados (catálogo + navegação).
- [ ] SEO básico revisado (title, description, canonical, Open Graph).
- [ ] `sitemap.xml` atualizado ao adicionar nova página pública.
- [ ] Toda URL pública listada em `jogos.html` e `ferramentas.html` também aparece no `sitemap.xml`.
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

## Boas práticas de revisão

- Prefira PRs de até ~300 linhas alteradas quando possível.
- Inclua capturas de tela ao alterar UI visual.
- Em mudanças de conteúdo, destaque impacto de SEO e acessibilidade.

## Dúvidas comuns

- **“Preciso atualizar o changelog para mudança de docs?”**
  - Sim, quando a mudança melhora onboarding, fluxo de contribuição ou governança.
- **“Preciso criar JS separado para toda ferramenta?”**
  - Preferencialmente sim, para manter isolamento e facilitar manutenção.
