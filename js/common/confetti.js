let confettiPromise = null;

function loadConfetti() {
  if (confettiPromise) return confettiPromise;
  confettiPromise = new Promise((resolve) => {
    if (typeof window.confetti === 'function') {
      resolve(window.confetti);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    script.onload = () => {
      resolve(window.confetti);
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return confettiPromise;
}

export async function fireConfetti() {
  const confetti = await loadConfetti();
  if (!confetti) return;
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.65 } });
}

export async function fireConfettiSides() {
  const confetti = await loadConfetti();
  if (!confetti) return;
  confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
  confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
}
