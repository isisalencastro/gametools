// Módulo do jogo de reação: controla rodada, valida clique e renderiza feedback.
import { buildErrorMessage, setLiveRegion } from '../common/utils.js';

export function initReactionFeature() {
  const reactionStart = document.getElementById('reaction-start');
  const reactionBox = document.getElementById('reaction-box');
  const reactionResult = document.getElementById('reaction-result');

  if (!reactionStart || !reactionBox || !reactionResult) return;

  let reactionTimer;
  let reactionStartedAt = 0;
  let canClickReaction = false;

  setLiveRegion(reactionResult);

  if (reactionBox.tagName !== 'BUTTON') {
    reactionBox.setAttribute('role', 'button');
    reactionBox.setAttribute('tabindex', '0');
    reactionBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        reactionBox.click();
      }
    });
  }

  reactionStart.addEventListener('click', () => {
    clearTimeout(reactionTimer);
    canClickReaction = false;
    reactionBox.style.background = '#e2e8f0';
    reactionBox.textContent = 'Aguarde o verde...';
    renderResult(reactionResult, 'Preparando nova rodada. Aguarde o sinal verde para clicar.');

    const delay = 1000 + Math.random() * 2500;
    reactionTimer = setTimeout(() => {
      canClickReaction = true;
      reactionStartedAt = performance.now();
      reactionBox.style.background = '#22c55e';
      reactionBox.textContent = 'CLIQUE!';
    }, delay);
  });

  reactionBox.addEventListener('click', () => {
    const validation = validateInput(canClickReaction);
    if (!validation.valid) {
      renderResult(reactionResult, validation.message);
      return;
    }

    const elapsed = Math.round(performance.now() - reactionStartedAt);
    canClickReaction = false;
    reactionBox.style.background = '#e2e8f0';
    reactionBox.textContent = 'Aguardando...';
    renderResult(reactionResult, `Seu tempo de reação foi ${elapsed} ms.`);
  });
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
