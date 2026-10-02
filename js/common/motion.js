// Movimento do site que depende de JS: revelar blocos ao rolar e o cabecalho que ganha
// sombra quando a pagina sai do topo. O resto do movimento e CSS puro (styles.css, MOVIMENTO).
// Sem JS nada fica escondido: o estado "ainda nao revelado" so vale com html.js-motion,
// classe que o proprio script poe.

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function initRevelar() {
  const blocos = [...document.querySelectorAll('[data-revelar]')];
  if (!blocos.length) return;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-motion');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('revelado');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  blocos.forEach((bloco) => observador.observe(bloco));
}

function initCabecalhoRolado() {
  const header = document.querySelector('.header');
  if (!header) return;
  let pendente = false;
  const atualizar = () => {
    header.classList.toggle('header-rolado', window.scrollY > 8);
    pendente = false;
  };
  window.addEventListener('scroll', () => {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(atualizar);
  }, { passive: true });
  atualizar();
}

export function initMotion() {
  initRevelar();
  initCabecalhoRolado();
}
