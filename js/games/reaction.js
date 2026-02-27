import { buildErrorMessage, copyToClipboard, setLiveRegion } from '../common/utils.js';

const BEST_STORAGE_KEY = 'gametools_reaction_best';

export function initReactionFeature() {
  const reactionStart = document.getElementById('reaction-start');
  const reactionBox = document.getElementById('reaction-box');
  const reactionResult = document.getElementById('reaction-result');
  const reactionHistory = document.getElementById('reaction-history');
  const reactionAvg = document.getElementById('reaction-avg');
  const reactionBest = document.getElementById('reaction-best');
  const reactionShare = document.getElementById('reaction-share');

  if (!reactionStart || !reactionBox || !reactionResult) return;

  let reactionTimer;
  let reactionStartedAt = 0;
  let canClickReaction = false;
  let attempts = [];
  let bestEver = Number(localStorage.getItem(BEST_STORAGE_KEY) || '0');

  setLiveRegion(reactionResult);

  function updateStats() {
    if (reactionAvg) {
      if (attempts.length > 0) {
        const avg = Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
        reactionAvg.textContent = `Média: ${avg} ms (${attempts.length} tentativa${attempts.length > 1 ? 's' : ''})`;
      } else {
        reactionAvg.textContent = 'Média: --';
      }
    }
    if (reactionBest) {
      reactionBest.textContent = bestEver > 0 ? `Recorde: ${bestEver} ms` : 'Recorde: --';
    }
    if (reactionHistory) {
      const last5 = attempts.slice(-5).reverse();
      reactionHistory.textContent = last5.length > 0
        ? `Últimas: ${last5.map((t) => `${t}ms`).join(' · ')}`
        : '';
    }
  }

  function classifyReaction(ms) {
    if (ms < 200) return 'Incr\u00edvel! Reflexos de elite.';
    if (ms < 300) return '\u00d3timo! Acima da m\u00e9dia.';
    if (ms < 400) return 'Bom, na m\u00e9dia humana.';
    if (ms < 600) return 'Regular. Continue praticando!';
    return 'Lento. Tente se concentrar mais!';
  }

  reactionStart.addEventListener('click', () => {
    clearTimeout(reactionTimer);
    canClickReaction = false;
    reactionBox.className = 'reaction-box state-waiting';
    reactionBox.textContent = 'Aguarde o verde...';
    renderResult(reactionResult, 'Preparando rodada. Aguarde o sinal verde para clicar.');

    const delay = 1500 + Math.random() * 3000;
    reactionTimer = setTimeout(() => {
      canClickReaction = true;
      reactionStartedAt = performance.now();
      reactionBox.className = 'reaction-box state-ready';
      reactionBox.textContent = 'CLIQUE AGORA!';
    }, delay);
  });

  reactionBox.addEventListener('click', () => {
    if (!canClickReaction) {
      if (reactionBox.classList.contains('state-waiting')) {
        clearTimeout(reactionTimer);
        reactionBox.className = 'reaction-box state-done';
        reactionBox.textContent = 'Cedo demais!';
        renderResult(reactionResult, buildErrorMessage('você clicou antes do sinal verde. Clique "Iniciar rodada" para tentar novamente.'));
      }
      return;
    }

    const elapsed = Math.round(performance.now() - reactionStartedAt);
    canClickReaction = false;
    reactionBox.className = 'reaction-box state-done';
    reactionBox.textContent = `${elapsed} ms`;

    attempts.push(elapsed);
    if (bestEver === 0 || elapsed < bestEver) {
      bestEver = elapsed;
      try { localStorage.setItem(BEST_STORAGE_KEY, String(bestEver)); } catch { /* noop */ }
    }

    renderResult(reactionResult, `Tempo: ${elapsed} ms · ${classifyReaction(elapsed)}`);
    updateStats();
  });

  if (reactionShare) {
    reactionShare.addEventListener('click', () => {
      const avg = attempts.length > 0
        ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
        : 0;
      const text = `Teste de Reação no GameTools: melhor ${bestEver}ms, média ${avg}ms em ${attempts.length} tentativas!`;
      if (navigator.share) {
        navigator.share({ title: 'Teste de Reação - GameTools', text }).catch(() => {});
        return;
      }
      copyToClipboard(text, reactionShare);
    });
  }

  updateStats();
}

export function validateInput(canClickReaction) {
  if (!canClickReaction) {
    return { valid: false, message: buildErrorMessage('clique apenas quando o bloco ficar verde.') };
  }
  return { valid: true, message: '' };
}

export function renderResult(target, message) {
  target.textContent = message;
}
