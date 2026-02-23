export function initRockPaperScissorsFeature() {
  const pptButtons = document.querySelectorAll('[data-ppt]');
  const pptStatus = document.getElementById('ppt-status');
  const pptResult = document.getElementById('ppt-result');
  const pptReset = document.getElementById('ppt-reset');
  const pptShare = document.getElementById('ppt-share');

  if (!pptButtons.length || !pptStatus || !pptResult || !pptReset || !pptShare) return;

  const pptStorageKey = 'gametools_ppt_best_streak';
  const pptChoices = ['pedra', 'papel', 'tesoura'];

  let pptPlayer = 0;
  let pptCpu = 0;
  let pptCurrentStreak = 0;
  let pptBestStreak = Number(localStorage.getItem(pptStorageKey) || '0');

  function pptUpdateStatus(extra = '') {
    pptStatus.textContent = `Placar: Você ${pptPlayer} x ${pptCpu} CPU · Melhor sequência: ${pptBestStreak}${extra}`;
  }

  function pptGetWinner(player, cpu) {
    if (player === cpu) return 'draw';
    if (
      (player === 'pedra' && cpu === 'tesoura') ||
      (player === 'papel' && cpu === 'pedra') ||
      (player === 'tesoura' && cpu === 'papel')
    ) {
      return 'player';
    }
    return 'cpu';
  }

  function pptPlay(playerChoice) {
    const cpuChoice = pptChoices[Math.floor(Math.random() * pptChoices.length)];
    const winner = pptGetWinner(playerChoice, cpuChoice);

    if (winner === 'player') {
      pptPlayer += 1;
      pptCurrentStreak += 1;
      if (pptCurrentStreak > pptBestStreak) {
        pptBestStreak = pptCurrentStreak;
        localStorage.setItem(pptStorageKey, String(pptBestStreak));
      }
      pptResult.textContent = `Você jogou ${playerChoice}, CPU jogou ${cpuChoice}. Você venceu!`;
    } else if (winner === 'cpu') {
      pptCpu += 1;
      pptCurrentStreak = 0;
      pptResult.textContent = `Você jogou ${playerChoice}, CPU jogou ${cpuChoice}. CPU venceu.`;
    } else {
      pptResult.textContent = `Empate! Ambos jogaram ${playerChoice}.`;
    }

    pptUpdateStatus();
  }

  function pptResetGame() {
    pptPlayer = 0;
    pptCpu = 0;
    pptCurrentStreak = 0;
    pptResult.textContent = 'Novo jogo iniciado.';
    pptUpdateStatus();
  }

  async function pptShareResult() {
    const text = `No Pedra-Papel-Tesoura estou ${pptPlayer} x ${pptCpu} com sequência máxima ${pptBestStreak} no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Pedra-Papel-Tesoura - GameTools', text });
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      pptUpdateStatus(' · Resultado copiado para compartilhar.');
      return;
    }

    pptUpdateStatus(' · Compartilhamento indisponível.');
  }

  pptButtons.forEach((button) => {
    button.addEventListener('click', () => pptPlay(button.dataset.ppt));
  });

  pptReset.addEventListener('click', pptResetGame);
  pptShare.addEventListener('click', () => {
    pptShareResult().catch(() => pptUpdateStatus(' · Falha ao compartilhar.'));
  });

  pptUpdateStatus();
}
