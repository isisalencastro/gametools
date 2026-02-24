const THEME_KEY = 'gametools:theme';

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function setButtonText(button, theme) {
  button.textContent = theme === 'dark' ? '☀️ Modo claro' : '🌙 Modo escuro';
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

    button.classList.add('toggling');

    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    setButtonText(button, next);

    button.addEventListener('animationend', () => {
      button.classList.remove('toggling');
    }, { once: true });
  });
}
