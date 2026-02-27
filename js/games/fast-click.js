import { copyToClipboard } from '../common/utils.js';
import { fireConfetti } from '../tools/confetti.js';

function vibrate(ms) {
  try {
    navigator?.vibrate?.(ms);
  } catch { /* not supported */ }
}

export function initFastClickFeature() {
  const clickStatus = document.getElementById('click-status');
  const clickTarget = document.getElementById('click-target');
  const clickReset = document.getElementById('click-reset');
  const clickShare = document.getElementById('click-share');
  const clickCountEl = document.getElementById('click-count');
  const clickProgressBar = document.getElementById('click-progress');

  if (!clickStatus || !clickTarget || !clickReset || !clickShare) return;

  const clickDuration = 10;
  const clickStorageKey = 'gametools_click_best';

  let clickCount = 0;
  let clickTimeLeft = clickDuration;
  let clickTimer = null;
  let clickRunning = false;

  function clickBest() {
    return Number(localStorage.getItem(clickStorageKey) || '0');
  }

  function clickUpdateStatus(extra = '') {
    const cps = clickTimeLeft < clickDuration && clickTimeLeft > 0
      ? (clickCount / (clickDuration - clickTimeLeft)).toFixed(1)
      : '0.0';
    clickStatus.textContent = `Tempo: ${clickTimeLeft}s · CPS: ${cps} · Melhor: ${clickBest()}${extra}`;
  }

  function updateProgressBar() {
    if (!clickProgressBar) return;
    const pct = (clickTimeLeft / clickDuration) * 100;
    clickProgressBar.style.width = `${pct}%`;
    clickProgressBar.classList.remove('warn', 'danger');
    if (pct <= 20) clickProgressBar.classList.add('danger');
    else if (pct <= 50) clickProgressBar.classList.add('warn');
  }

  function updateCountDisplay() {
    if (!clickCountEl) return;
    clickCountEl.textContent = clickCount;
    clickCountEl.classList.add('bump');
    setTimeout(() => clickCountEl.classList.remove('bump'), 100);
  }

  function clickFinish() {
    clearInterval(clickTimer);
    clickRunning = false;
    const isNewBest = clickCount > clickBest();
    if (isNewBest) {
      localStorage.setItem(clickStorageKey, String(clickCount));
    }
    clickTarget.textContent = 'Tempo finalizado!';
    clickTarget.classList.remove('idle');
    clickTarget.classList.add('finished');
    clickUpdateStatus(isNewBest ? ' · Novo recorde!' : ' · Fim!');

    if (isNewBest || clickCount >= 30) {
      fireConfetti();
    }
    vibrate([50, 30, 50]);
  }

  function clickTick() {
    clickTimeLeft -= 1;
    clickUpdateStatus();
    updateProgressBar();
    if (clickTimeLeft <= 0) {
      clickFinish();
    }
  }

  function clickStart() {
    if (clickRunning) return;
    clickRunning = true;
    clickTarget.textContent = 'Toque! Toque! Toque!';
    clickTarget.classList.remove('idle', 'finished');
    clickTimer = setInterval(clickTick, 1000);
  }

  function clickHandle(e) {
    e.preventDefault();

    if (!clickRunning) {
      clickStart();
    }

    if (!clickRunning) return;
    clickCount += 1;
    vibrate(10);
    clickUpdateStatus();
    updateCountDisplay();
  }

  function clickResetGame() {
    clearInterval(clickTimer);
    clickCount = 0;
    clickTimeLeft = clickDuration;
    clickRunning = false;
    clickTarget.textContent = 'Toque para iniciar';
    clickTarget.classList.add('idle');
    clickTarget.classList.remove('finished');
    clickUpdateStatus();
    updateCountDisplay();
    updateProgressBar();
  }

  async function clickShareResult() {
    const text = `No Clique Rápido 10s fiz ${clickCount} cliques (${(clickCount / clickDuration).toFixed(1)} CPS) no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Clique Rápido 10s - GameTools', text });
      return;
    }
    copyToClipboard(text, clickShare);
  }

  clickTarget.addEventListener('pointerdown', clickHandle);

  clickTarget.addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });

  clickReset.addEventListener('click', clickResetGame);
  clickShare.addEventListener('click', () => {
    clickShareResult().catch(() => clickUpdateStatus(' · Falha ao compartilhar.'));
  });

  clickResetGame();
}
