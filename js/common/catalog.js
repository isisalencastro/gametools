export function initCatalogExperience() {
  const root = document.querySelector('[data-catalog-root]');
  if (!root) return;

  const search = root.querySelector('#catalog-search');
  const filter = root.querySelector('#catalog-filter');
  const clear = root.querySelector('#catalog-clear');
  const count = root.querySelector('#catalog-count');
  const empty = root.querySelector('#catalog-empty');
  const items = [...root.querySelectorAll('[data-catalog-item]')];

  function applyFilters() {
    const term = (search?.value || '').trim().toLowerCase();
    const category = (filter?.value || 'all').toLowerCase();
    let visible = 0;

    items.forEach((item) => {
      const tags = (item.dataset.tags || '').toLowerCase();
      const title = (item.dataset.title || '').toLowerCase();
      const matchesTerm = !term || title.includes(term) || tags.includes(term);
      const matchesCategory = category === 'all' || tags.includes(category);
      const show = matchesTerm && matchesCategory;

      item.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} resultado(s) exibido(s).`;
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }

  search?.addEventListener('input', applyFilters);
  filter?.addEventListener('change', applyFilters);
  clear?.addEventListener('click', () => {
    if (search) search.value = '';
    if (filter) filter.value = 'all';
    applyFilters();
  });

  applyFilters();
}
