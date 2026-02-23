export function initMemoryFeature() {
  const memoriaGrid = document.getElementById('memoria-grid');
  const memoriaStatus = document.getElementById('memoria-status');
  const memoriaReset = document.getElementById('memoria-reset');
  const memoriaShare = document.getElementById('memoria-share');

  if (!memoriaGrid || !memoriaStatus || !memoriaReset || !memoriaShare) return;

  const memoriaStorageKey = 'gametools_memoria_best';
  const memoriaBase = ['🐱', '🐶', '🦊', '🐼', '🐸', '🐵'];
  let memoriaCards = [];
  let memoriaFirst = null;
  let memoriaLock = false;
  let memoriaMoves = 0;
  let memoriaMatches = 0;
  let memoriaTimer = null;
  let memoriaTime = 0;

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
      return `${parsed.time}s / ${parsed.moves} jogadas`;
    } catch {
      return '--';
    }
  }

  function memoriaUpdateStatus(extra = '') {
    memoriaStatus.textContent = `Tempo: ${memoriaTime}s · Jogadas: ${memoriaMoves} · Melhor: ${memoriaBestLabel()}${extra}`;
  }

  function memoriaTick() {
    memoriaTime += 1;
    memoriaUpdateStatus();
  }

  function memoriaStart() {
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
    memoriaUpdateStatus(' · Parabéns! Você completou todos os pares.');
  }

  function memoriaFlip(button) {
    if (memoriaLock || button.classList.contains('matched') || button === memoriaFirst) return;

    button.textContent = button.dataset.value;
    button.classList.add('flipped');

    if (!memoriaFirst) {
      memoriaFirst = button;
      return;
    }

    memoriaMoves += 1;
    memoriaUpdateStatus();

    if (memoriaFirst.dataset.value === button.dataset.value) {
      memoriaFirst.classList.add('matched');
      button.classList.add('matched');
      memoriaFirst = null;
      memoriaMatches += 1;

      if (memoriaMatches === memoriaBase.length) {
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
      memoriaLock = false;
    }, 650);
  }

  function memoriaRender() {
    memoriaGrid.innerHTML = '';
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
    memoriaCards = memoriaShuffle([...memoriaBase, ...memoriaBase]);
    memoriaFirst = null;
    memoriaLock = false;
    memoriaMoves = 0;
    memoriaMatches = 0;
    memoriaTime = 0;
    memoriaRender();
    memoriaUpdateStatus();
    memoriaStart();
  }

  async function memoriaShareResult() {
    const text = `No Jogo da Memória fiz ${memoriaMoves} jogadas em ${memoriaTime}s no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Jogo da Memória - GameTools', text });
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      memoriaUpdateStatus(' · Resultado copiado para a área de transferência.');
      return;
    }

    memoriaUpdateStatus(' · Não foi possível compartilhar automaticamente.');
  }

  memoriaReset.addEventListener('click', memoriaResetGame);
  memoriaShare.addEventListener('click', () => {
    memoriaShareResult().catch(() => memoriaUpdateStatus(' · Compartilhamento não disponível.'));
  });

  memoriaResetGame();
}
