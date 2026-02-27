import { copyToClipboard } from '../common/utils.js';
import { fireConfetti } from '../tools/confetti.js';

const EMOJIS = { pedra: '✊', papel: '✋', tesoura: '✌️' };
const CHOICES = ['pedra', 'papel', 'tesoura'];

export function initRockPaperScissorsFeature() {
  const pptButtons = document.querySelectorAll('[data-ppt]');
  const pptStatus = document.getElementById('ppt-status');
  const pptResult = document.getElementById('ppt-result');
  const pptReset = document.getElementById('ppt-reset');
  const pptShare = document.getElementById('ppt-share');
  const pptArena = document.getElementById('ppt-arena');

  if (!pptButtons.length || !pptStatus || !pptResult || !pptReset || !pptShare) return;

  const pptStorageKey = 'gametools_ppt_best_streak';

  let pptPlayer = 0;
  let pptCpu = 0;
  let pptDraws = 0;
  let pptCurrentStreak = 0;
  let pptBestStreak = Number(localStorage.getItem(pptStorageKey) || '0');
  let pptRounds = 0;

  function pptUpdateStatus() {
    pptStatus.textContent = `Placar: Você ${pptPlayer} × ${pptCpu} CPU · Empates: ${pptDraws} · Sequência: ${pptCurrentStreak} · Recorde: ${pptBestStreak}`;
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

  function renderArena(playerChoice, cpuChoice, winner) {
    if (!pptArena) return;
    const winClass = winner === 'player' ? 'style="border-color:#22c55e"' : '';
    const loseClass = winner === 'cpu' ? 'style="border-color:#ef4444"' : '';
    pptArena.innerHTML = `
      <div class="ppt-hand" ${winClass}>${EMOJIS[playerChoice]}</div>
      <span class="ppt-vs">VS</span>
      <div class="ppt-hand" ${loseClass}>${EMOJIS[cpuChoice]}</div>
    `;
  }

  function pptPlay(playerChoice) {
    const cpuChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const winner = pptGetWinner(playerChoice, cpuChoice);
    pptRounds += 1;

    renderArena(playerChoice, cpuChoice, winner);

    if (winner === 'player') {
      pptPlayer += 1;
      pptCurrentStreak += 1;
      if (pptCurrentStreak > pptBestStreak) {
        pptBestStreak = pptCurrentStreak;
        localStorage.setItem(pptStorageKey, String(pptBestStreak));
      }
      pptResult.textContent = `Você jogou ${EMOJIS[playerChoice]}, CPU jogou ${EMOJIS[cpuChoice]}. Você venceu!`;
      if (pptCurrentStreak >= 3) fireConfetti();
    } else if (winner === 'cpu') {
      pptCpu += 1;
      pptCurrentStreak = 0;
      pptResult.textContent = `Você jogou ${EMOJIS[playerChoice]}, CPU jogou ${EMOJIS[cpuChoice]}. CPU venceu.`;
    } else {
      pptDraws += 1;
      pptResult.textContent = `Empate! Ambos jogaram ${EMOJIS[playerChoice]}.`;
    }

    pptUpdateStatus();
  }

  function pptResetGame() {
    pptPlayer = 0;
    pptCpu = 0;
    pptDraws = 0;
    pptCurrentStreak = 0;
    pptRounds = 0;
    pptResult.textContent = 'Escolha sua jogada!';
    if (pptArena) pptArena.innerHTML = '';
    pptUpdateStatus();
  }

  async function pptShareResult() {
    const winRate = pptRounds > 0 ? ((pptPlayer / pptRounds) * 100).toFixed(0) : 0;
    const text = `No Pedra-Papel-Tesoura: ${pptPlayer}×${pptCpu} (${winRate}% vitórias, sequência máx ${pptBestStreak}) no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Pedra-Papel-Tesoura - GameTools', text });
      return;
    }
    copyToClipboard(text, pptShare);
  }

  pptButtons.forEach((button) => {
    button.addEventListener('click', () => pptPlay(button.dataset.ppt));
  });

  pptReset.addEventListener('click', pptResetGame);
  pptShare.addEventListener('click', () => {
    pptShareResult().catch(() => pptUpdateStatus());
  });

  pptUpdateStatus();
}
