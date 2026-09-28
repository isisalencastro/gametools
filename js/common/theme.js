const THEME_KEY = 'gametools:theme';

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch {
    // Navegador embutido (WhatsApp, Instagram) bloqueia o armazenamento. Sem esta
    // protecao a excecao sobe e derruba a inicializacao inteira da pagina: menu do
    // celular, catalogo e jogo param junto, sem nada aparecer na tela.
    return 'light';
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Sem armazenamento o tema vale so nesta visita. Nao e motivo para quebrar a pagina.
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function setButtonText(button, theme) {
  button.textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
}

export function initThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);
  setButtonText(button, initialTheme);

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    applyTheme(next);
    saveTheme(next);
    setButtonText(button, next);
  });
}
