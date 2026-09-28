# Template de Novo Jogo

Use este template ao criar uma nova página de jogo para manter consistência de UX, SEO e manutenção.

---

## 1) Informações do jogo

- **Nome do jogo**:
- **Slug** (kebab-case):
- **Página HTML**: `jogos/<slug>.html`
- **Módulo JS**: `js/games/<slug>.js`
- **Categoria** (reflexo | estrategia | conhecimento | logica):
- **Objetivo em 1 frase**:
- **Público-alvo principal**:

### Exemplo preenchido

- **Nome do jogo**: Jogo da Velha
- **Slug**: `jogo-da-velha`
- **Página HTML**: `jogos/jogo-da-velha.html`
- **Módulo JS**: `js/games/jogo-da-velha.js`
- **Categoria**: `estrategia`
- **Objetivo em 1 frase**: Permitir uma partida rápida de jogo da velha contra a CPU.
- **Público-alvo principal**: quem quer uma pausa curta de raciocínio.

---

## 2) Estrutura mínima da página

Checklist:

- [ ] `<title>` específico (até ~60 caracteres).
- [ ] `meta name="description"` com proposta de valor.
- [ ] `link rel="canonical"` com URL absoluta da página.
- [ ] `<main id="conteudo-principal">` com heading claro (`<h1>`).
- [ ] Bloco de instruções curtas (como jogar).
- [ ] Área de resultado com `aria-live="polite"`.
- [ ] Link de contexto para outro jogo ou para o catálogo.
- [ ] FAQ curta (2 a 4 perguntas) para contexto de SEO.

### Esqueleto sugerido (HTML)

```html
<main id="conteudo-principal" class="container page-main">
  <section class="section-intro">
    <h1>Jogo da Velha</h1>
    <p>Marque três casas em linha antes da CPU.</p>
  </section>

  <section class="section">
    <article class="card game-card">
      <button id="jdv-iniciar" class="btn btn-primary" type="button">Iniciar partida</button>
      <div id="jdv-tabuleiro" class="grid three-columns" role="group" aria-label="Tabuleiro"></div>
      <p id="jdv-resultado" class="result" role="status" aria-live="polite">Seu resultado aparecerá aqui.</p>
    </article>
  </section>
</main>
```

---

## 3) Implementação JavaScript

Checklist:

- [ ] JS em arquivo separado (`js/games/<slug>.js`).
- [ ] Guard check dos elementos de DOM no início da função (`if (!el) return;`).
- [ ] Validar entradas antes de calcular qualquer coisa.
- [ ] Tratar estados inválidos com mensagem clara.
- [ ] Atualizar resultado com texto compreensível.

### Exemplo rápido (JS)

```js
import { setLiveRegion } from '../common/utils.js';

export function initJogoDaVelhaFeature() {
  const botao = document.getElementById('jdv-iniciar');
  const resultado = document.getElementById('jdv-resultado');
  if (!botao || !resultado) return;

  setLiveRegion(resultado);

  botao.addEventListener('click', () => {
    resultado.textContent = 'Partida iniciada.';
  });
}
```

---

## 4) Integração no projeto

Checklist:

- [ ] Adicionar card no catálogo (`jogos.html`), com `data-catalog-item`, `data-tags` e `data-title`.
- [ ] Importar e chamar `init*Feature()` em `js/main.js`.
- [ ] Revisar navegação entre páginas.
- [ ] Incluir URL no `sitemap.xml`.
- [ ] Confirmar regra no `robots.txt` (sitemap correto).

---

## 5) Critérios de aceite

- [ ] Regra do jogo funciona em desktop e mobile.
- [ ] Página acessível por teclado.
- [ ] Foco visível em campos e botões.
- [ ] Contraste mínimo de 4.5:1 em texto pequeno e 3:1 em texto grande e elemento gráfico.
- [ ] Mensagens de erro e sucesso claras.
- [ ] Zero erro no console do navegador.
- [ ] `npm run lint` sem erros.

---

## 6) Resumo para PR

```md
### O que foi feito
- Adicionado o jogo "Jogo da Velha".
- Criada página `jogos/jogo-da-velha.html`.
- Implementada a lógica em `js/games/jogo-da-velha.js`.
- Atualizados `jogos.html`, `js/main.js` e `sitemap.xml`.

### Como validar
1. Acesse `jogos/jogo-da-velha.html`.
2. Inicie uma partida e faça três jogadas.
3. Confira o resultado na área de status.
4. Rode `npm run lint`.
```
