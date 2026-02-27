import { copyToClipboard } from '../common/utils.js';
import { fireConfettiSides } from '../tools/confetti.js';

const EMOJI_POOLS = {
  6: ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵'],
  8: ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵', '🦁', '🐧'],
  10: ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵', '🦁', '🐧', '🐙', '🦋'],
};

export function initMemoryFeature() {
  const memoriaGrid = document.getElementById('memoria-grid');
  const memoriaStatus = document.getElementById('memoria-status');
  const memoriaReset = document.getElementById('memoria-reset');
  const memoriaShare = document.getElementById('memoria-share');
  const difficultySelect = document.getElementById('memoria-difficulty');

  if (!memoriaGrid || !memoriaStatus || !memoriaReset || !memoriaShare) return;

  const memoriaStorageKey = 'gametools_memoria_best';

  let pairCount = difficultySelect ? Number(difficultySelect.value) || 6 : 6;
  let memoriaCards = [];
  let memoriaFirst = null;
  let memoriaLock = false;
  let memoriaMoves = 0;
  let memoriaMatches = 0;
  let memoriaTimer = null;
  let memoriaTime = 0;
  let gameStarted = false;

  function memoriaShuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function memoriaBestLabel() {
    const raw = localStorage.getItem(memoriaStorageKey);
    if (!raw) return '--';
    try {
      const parsed = JSON.parse(raw);
      return `${parsed.time}s / ${parsed.moves} jog.`;
    } catch {
      return '--';
    }
  }

  function memoriaUpdateStatus(extra = '') {
    memoriaStatus.textContent = `Tempo: ${memoriaTime}s · Jogadas: ${memoriaMoves} · Pares: ${memoriaMatches}/${pairCount} · Melhor: ${memoriaBestLabel()}${extra}`;
  }

  function memoriaTick() {
    memoriaTime += 1;
    memoriaUpdateStatus();
  }

  function memoriaStart() {
    if (gameStarted) return;
    gameStarted = true;
    clearInterval(memoriaTimer);
    memoriaTimer = setInterval(memoriaTick, 1000);
  }

  function memoriaStop() {
    clearInterval(memoriaTimer);
  }

  function memoriaSaveBest() {
    const raw = localStorage.getItem(memoriaStorageKey);
    const current = { time: memoriaTime, moves: memoriaMoves };
    if (!raw) {
      localStorage.setItem(memoriaStorageKey, JSON.stringify(current));
      return;
    }
    try {
      const best = JSON.parse(raw);
      if (current.time < best.time || (current.time === best.time && current.moves < best.moves)) {
        localStorage.setItem(memoriaStorageKey, JSON.stringify(current));
      }
    } catch {
      localStorage.setItem(memoriaStorageKey, JSON.stringify(current));
    }
  }

  function memoriaWin() {
    memoriaStop();
    memoriaSaveBest();
    memoriaUpdateStatus(' · Parabéns! Todos os pares encontrados!');
    fireConfettiSides();
  }

  function memoriaFlip(button) {
    if (memoriaLock || button.classList.contains('matched') || button === memoriaFirst) return;

    memoriaStart();

    button.textContent = button.dataset.value;
    button.classList.add('flipped');
    button.setAttribute('aria-label', `Carta: ${button.dataset.value}`);

    if (!memoriaFirst) {
      memoriaFirst = button;
      return;
    }

    memoriaMoves += 1;
    memoriaUpdateStatus();

    if (memoriaFirst.dataset.value === button.dataset.value) {
      memoriaFirst.classList.remove('flipped');
      memoriaFirst.classList.add('matched');
      button.classList.remove('flipped');
      button.classList.add('matched');
      memoriaFirst = null;
      memoriaMatches += 1;

      if (memoriaMatches === pairCount) {
        memoriaWin();
      }
      return;
    }

    memoriaLock = true;
    const first = memoriaFirst;
    memoriaFirst = null;

    setTimeout(() => {
      first.textContent = '?';
      button.textContent = '?';
      first.classList.remove('flipped');
      button.classList.remove('flipped');
      first.setAttribute('aria-label', 'Carta virada para baixo');
      button.setAttribute('aria-label', 'Carta virada para baixo');
      memoriaLock = false;
    }, 600);
  }

  function memoriaRender() {
    memoriaGrid.innerHTML = '';
    memoriaGrid.className = `memory-grid grid-${pairCount}`;
    memoriaCards.forEach((value) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memory-card';
      btn.textContent = '?';
      btn.dataset.value = value;
      btn.setAttribute('aria-label', 'Carta virada para baixo');
      btn.addEventListener('click', () => memoriaFlip(btn));
      memoriaGrid.appendChild(btn);
    });
  }

  function memoriaResetGame() {
    const base = EMOJI_POOLS[pairCount] || EMOJI_POOLS[6];
    memoriaCards = memoriaShuffle([...base, ...base]);
    memoriaFirst = null;
    memoriaLock = false;
    memoriaMoves = 0;
    memoriaMatches = 0;
    memoriaTime = 0;
    gameStarted = false;
    memoriaStop();
    memoriaRender();
    memoriaUpdateStatus();
  }

  async function memoriaShareResult() {
    const text = `No Jogo da Memória (${pairCount} pares) fiz ${memoriaMoves} jogadas em ${memoriaTime}s no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Jogo da Memória - GameTools', text });
      return;
    }
    copyToClipboard(text, memoriaShare);
  }

  if (difficultySelect) {
    difficultySelect.addEventListener('change', () => {
      pairCount = Number(difficultySelect.value) || 6;
      memoriaResetGame();
    });
  }

  memoriaReset.addEventListener('click', memoriaResetGame);
  memoriaShare.addEventListener('click', () => {
    memoriaShareResult().catch(() => memoriaUpdateStatus(' · Compartilhamento não disponível.'));
  });

  memoriaResetGame();
}
