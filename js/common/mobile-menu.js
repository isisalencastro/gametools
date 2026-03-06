const BREAKPOINT = 760;

function closeMenu(navContainer, toggle) {
  navContainer.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu de navegação');
}

export function initMobileMenu() {
  const navContainer = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!toggle || !navContainer) return;

  toggle.addEventListener('click', () => {
    const isOpen = navContainer.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label',
      isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
    );
  });

  navContainer.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => closeMenu(navContainer, toggle));
  });

  document.addEventListener('click', (e) => {
    if (navContainer.classList.contains('menu-open') && !navContainer.contains(e.target)) {
      closeMenu(navContainer, toggle);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > BREAKPOINT && navContainer.classList.contains('menu-open')) {
      closeMenu(navContainer, toggle);
    }
  });
}
