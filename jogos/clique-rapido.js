const clickStatus = document.getElementById('click-status');
const clickTarget = document.getElementById('click-target');
const clickReset = document.getElementById('click-reset');
const clickShare = document.getElementById('click-share');

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
  clickStatus.textContent = `Tempo: ${clickTimeLeft}s · Cliques: ${clickCount} · Melhor: ${clickBest()}${extra}`;
}

function clickFinish() {
  clearInterval(clickTimer);
  clickRunning = false;
  if (clickCount > clickBest()) {
    localStorage.setItem(clickStorageKey, String(clickCount));
  }
  clickUpdateStatus(' · Tempo encerrado!');
  clickTarget.textContent = 'Tempo finalizado';
}

function clickTick() {
  clickTimeLeft -= 1;
  clickUpdateStatus();
  if (clickTimeLeft <= 0) {
    clickFinish();
  }
}

function clickStart() {
  if (clickRunning) return;
  clickRunning = true;
  clickTarget.textContent = 'Clique! Clique! Clique!';
  clickTimer = setInterval(clickTick, 1000);
}

function clickHandle() {
  if (!clickRunning) {
    clickStart();
  }

  if (!clickRunning) return;
  clickCount += 1;
  clickUpdateStatus();
}

function clickResetGame() {
  clearInterval(clickTimer);
  clickCount = 0;
  clickTimeLeft = clickDuration;
  clickRunning = false;
  clickTarget.textContent = 'Iniciar e clicar';
  clickUpdateStatus();
}

async function clickShareResult() {
  const text = `No Clique Rápido 10s fiz ${clickCount} cliques no GameTools!`;
  if (navigator.share) {
    await navigator.share({ title: 'Clique Rápido 10s - GameTools', text });
    return;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    clickUpdateStatus(' · Resultado copiado para compartilhar.');
    return;
  }

  clickUpdateStatus(' · Compartilhamento indisponível.');
}

clickTarget.addEventListener('click', clickHandle);
clickReset.addEventListener('click', clickResetGame);
clickShare.addEventListener('click', () => {
  clickShareResult().catch(() => clickUpdateStatus(' · Falha ao compartilhar.'));
});

clickResetGame();
