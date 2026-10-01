function normalizeSearchValue(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Tempo da saida do cartao: o mesmo --dur-2 do styles.css.
const EXIT_MS = 200;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function initCatalogExperience() {
  const root = document.querySelector('[data-catalog-root]');
  if (!root) return;

  const search = root.querySelector('#catalog-search');
  const chips = [...root.querySelectorAll('[data-catalog-chip]')];
  const count = root.querySelector('#catalog-count');
  const empty = root.querySelector('#catalog-empty');
  const reset = root.querySelector('#catalog-reset');
  const items = [...root.querySelectorAll('[data-catalog-item]')];
  let category = 'all';

  const matchesCategory = (item, value) =>
    value === 'all' || normalizeSearchValue(item.dataset.tags).split(/\s+/).includes(value);

  // Cada botao de categoria mostra quantos jogos tem. Categoria sem jogo nao aparece:
  // oferecer um filtro que sempre da zero e pior do que nao oferecer.
  chips.forEach((chip) => {
    const value = normalizeSearchValue(chip.dataset.catalogChip);
    const total = items.filter((item) => matchesCategory(item, value)).length;
    if (total === 0) {
      chip.hidden = true;
      return;
    }
    const badge = chip.querySelector('.chip-total');
    if (badge) badge.textContent = String(total);
  });

  function show(item) {
    clearTimeout(item.saida);
    item.hidden = false;
    // Um quadro para o navegador montar o cartao antes de tirar a classe de saida.
    requestAnimationFrame(() => item.classList.remove('is-saindo'));
  }

  function hide(item) {
    if (item.hidden) return;
    if (prefersReducedMotion()) {
      item.hidden = true;
      return;
    }
    item.classList.add('is-saindo');
    clearTimeout(item.saida);
    item.saida = setTimeout(() => {
      item.hidden = true;
    }, EXIT_MS);
  }

  function applyFilters() {
    const term = normalizeSearchValue(search?.value);
    let visible = 0;

    items.forEach((item) => {
      const tags = normalizeSearchValue(item.dataset.tags);
      const title = normalizeSearchValue(item.dataset.title);
      const matchesTerm = !term || title.includes(term) || tags.includes(term);
      const visibleNow = matchesTerm && matchesCategory(item, category);

      if (visibleNow) {
        show(item);
        visible += 1;
      } else {
        hide(item);
      }
    });

    if (count) count.textContent = `${visible} ${visible === 1 ? 'jogo' : 'jogos'}`;
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }

  function selectChip(value) {
    category = value;
    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(normalizeSearchValue(chip.dataset.catalogChip) === value));
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      selectChip(normalizeSearchValue(chip.dataset.catalogChip));
      applyFilters();
    });
  });

  search?.addEventListener('input', applyFilters);

  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    selectChip('all');
    applyFilters();
    search?.focus();
  });

  selectChip('all');
  applyFilters();
}
