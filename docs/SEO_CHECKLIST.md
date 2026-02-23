# SEO Checklist por Página

Use este checklist sempre que criar ou alterar uma página pública.

## 1) Metatags obrigatórias

- [ ] `<title>` único e descritivo.
- [ ] `<meta name="description">` com 140-160 caracteres (referência).
- [ ] `<meta name="robots" content="index,follow">` quando indexável.
- [ ] Open Graph mínimo:
  - [ ] `og:title`
  - [ ] `og:description`
  - [ ] `og:type`
  - [ ] `og:url`
  - [ ] `og:image`
- [ ] Twitter cards mínimo:
  - [ ] `twitter:card`
  - [ ] `twitter:title`
  - [ ] `twitter:description`
  - [ ] `twitter:image`

### Exemplo mínimo (head)

```html
<title>Calculadora de Desconto | IBAGameTools</title>
<meta name="description" content="Calcule rapidamente preço final após desconto percentual com resultado instantâneo.">
<link rel="canonical" href="https://isisalencastro.github.io/gametools/ferramentas/desconto.html">
<meta property="og:title" content="Calculadora de Desconto | IBAGameTools">
<meta property="og:description" content="Descubra o valor final com desconto em segundos.">
<meta property="og:url" content="https://isisalencastro.github.io/gametools/ferramentas/desconto.html">
<meta property="og:image" content="https://isisalencastro.github.io/gametools/assets/social-card.png">
<meta name="twitter:card" content="summary_large_image">
```

### Observações para o projeto IBAGameTools

- A faixa de 140-160 caracteres em `description` é uma referência; em páginas específicas, pode variar para manter clareza do conteúdo.
- `og:image` e `twitter:image` atualmente apontam para `assets/social-card.png`, que **ainda não existe** no repositório. As páginas já declaram essa URL nas metatags. Ao criar a imagem, mantenha as dimensões recomendadas de 1200x630px.
- Enquanto a imagem social não for criada, ferramentas de preview (Facebook Debugger, Twitter Card Validator) exibirão fallback sem imagem.

## 2) Canonical e URL

- [ ] `canonical` aponta para a versão preferida da própria página.
- [ ] URL final é estável (evitar mudanças frequentes de slug).
- [ ] Consistência entre:
  - [ ] canonical
  - [ ] `og:url`
  - [ ] entrada correspondente no `sitemap.xml`

## 3) Sitemap e indexação

- [ ] URL adicionada no `sitemap.xml`.
- [ ] `robots.txt` referencia sitemap correto.
- [ ] Nova página acessível por link interno (catálogo ou home).

### Exemplo de entrada no sitemap

```xml
<url>
  <loc>https://isisalencastro.github.io/gametools/ferramentas/desconto.html</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

## 4) Conteúdo mínimo por página

Para reduzir thin content, garantir:

- [ ] 1 heading principal (`h1`) claro.
- [ ] 1 parágrafo introdutório explicando utilidade.
- [ ] Instruções de uso (passo a passo curto).
- [ ] Seção de resultado/feedback.
- [ ] FAQ com 2+ perguntas objetivas.
- [ ] CTA interno para outra página relacionada.

## 5) Qualidade semântica e UX

- [ ] Hierarquia de headings coerente (`h1` -> `h2` -> `h3`).
- [ ] Labels em formulários e textos compreensíveis.
- [ ] Tempo de carregamento aceitável (sem assets desnecessários).
- [ ] Conteúdo legível em mobile sem zoom horizontal.

## 6) Validação final (exemplo prático)

Fluxo recomendado antes do merge:

1. Validar tags no HTML da página nova.
2. Conferir atualização de `sitemap.xml` e `robots.txt`.
3. Executar `npm run lint`.
4. Revisar preview local via `python3 -m http.server 8080`.

Comando útil:

```bash
npm run lint
```
