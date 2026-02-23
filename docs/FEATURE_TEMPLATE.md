# Feature Template (Jogos e Ferramentas)

Use este template ao criar uma nova página para manter consistência de UX, SEO e manutenção.

---

## 1) Informações da feature

- **Tipo**: `jogo` | `ferramenta`
- **Nome da feature**:
- **Slug** (kebab-case):
- **URL final**: `/<categoria>/<slug>.html`
- **Objetivo em 1 frase**:
- **Público-alvo principal**:

### Exemplo preenchido

- **Tipo**: `ferramenta`
- **Nome da feature**: Calculadora de Desconto
- **Slug**: `desconto`
- **URL final**: `/ferramentas/desconto.html`
- **Objetivo em 1 frase**: Permitir cálculo rápido de valor final após desconto percentual.
- **Público-alvo principal**: usuários que fazem comparações de preço.

---

## 2) Estrutura mínima da página

Checklist:

- [ ] `<title>` específico (até ~60 caracteres).
- [ ] `meta name="description"` com proposta de valor.
- [ ] `link rel="canonical"` com URL absoluta da página.
- [ ] `<main id="conteudo">` com heading claro (`<h1>`).
- [ ] Formulário com labels explícitas e validação amigável.
- [ ] Bloco de resultado com `aria-live="polite"`.
- [ ] FAQ curta (2 a 4 perguntas) para contexto de SEO.

### Esqueleto sugerido (HTML)

```html
<main id="conteudo" class="container">
  <h1>Calculadora de Desconto</h1>
  <p>Informe preço e percentual para calcular o valor final.</p>

  <form id="desconto-form">
    <label for="preco">Preço original</label>
    <input id="preco" type="number" min="0" step="0.01" required>

    <label for="percentual">Desconto (%)</label>
    <input id="percentual" type="number" min="0" max="100" step="0.01" required>

    <button type="submit">Calcular</button>
  </form>

  <section id="resultado" role="status" aria-live="polite"></section>
</main>
```

---

## 3) Implementação JavaScript

Checklist:

- [ ] JS em arquivo separado (`jogos/<slug>.js` ou `js/tools/<slug>.js`).
- [ ] Validar entradas antes do cálculo.
- [ ] Tratar estados inválidos com mensagem clara.
- [ ] Atualizar resultado com texto compreensível.

### Exemplo rápido (JS)

```js
const form = document.querySelector('#desconto-form');
const resultado = document.querySelector('#resultado');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const preco = Number(document.querySelector('#preco').value);
  const percentual = Number(document.querySelector('#percentual').value);

  if (preco <= 0 || percentual < 0 || percentual > 100) {
    resultado.textContent = 'Preencha valores válidos para continuar.';
    return;
  }

  const valorDesconto = preco * (percentual / 100);
  const valorFinal = preco - valorDesconto;

  resultado.textContent = `Valor final: R$ ${valorFinal.toFixed(2)}`;
});
```

---

## 4) Integração no projeto

Checklist:

- [ ] Adicionar link no catálogo (`jogos.html` ou `ferramentas.html`).
- [ ] Revisar navegação entre páginas.
- [ ] Incluir URL no `sitemap.xml`.
- [ ] Confirmar regra no `robots.txt` (sitemap correto).

### Exemplo prático de integração

1. Criar `ferramentas/desconto.html`.
2. Criar `js/tools/desconto.js`.
3. Inserir card/link em `ferramentas.html`.
4. Adicionar `<url><loc>https://seu-dominio.com/ferramentas/desconto.html</loc></url>` em `sitemap.xml`.

---

## 5) Critérios de aceite

- [ ] Cálculo/regra funciona em desktop e mobile.
- [ ] Página acessível por teclado.
- [ ] Foco visível em campos e botões.
- [ ] Mensagens de erro e sucesso claras.
- [ ] `npm run lint` sem erros.

---

## 6) Resumo para PR

```md
### O que foi feito
- Adicionada a ferramenta "Calculadora de Desconto".
- Criada página `ferramentas/desconto.html`.
- Implementada lógica em `js/tools/desconto.js`.
- Atualizado `ferramentas.html` e `sitemap.xml`.

### Como validar
1. Acesse `/ferramentas/desconto.html`.
2. Informe `100` e `15`.
3. Confira resultado `R$ 85,00`.
4. Rode `npm run lint`.
```
