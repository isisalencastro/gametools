// Módulo do jogo de adivinhação: gerencia tentativas, dicas e reset de rodada.
import { buildErrorMessage, parseNumericInput, setLiveRegion } from '../common/utils.js';

export function initGuessFeature() {
  const guessInput = document.getElementById('guess-input');
  const guessBtn = document.getElementById('guess-btn');
  const guessReset = document.getElementById('guess-reset');
  const guessResult = document.getElementById('guess-result');

  if (!guessInput || !guessBtn || !guessReset || !guessResult) return;

  let secret = randomSecret();
  let attempts = 10;

  setLiveRegion(guessResult);

  function resetGuess() {
    secret = randomSecret();
    attempts = 10;
    renderResult(guessResult, 'Você tem 10 tentativas.');
    guessInput.value = '';
    guessInput.removeAttribute('aria-invalid');
    guessBtn.disabled = false;
  }

  function checkGuess() {
    const value = parseNumericInput(guessInput);
    const validation = validateInput(value);

    if (!validation.valid) {
      guessInput.setAttribute('aria-invalid', 'true');
      renderResult(guessResult, validation.message);
      return;
    }

    guessInput.removeAttribute('aria-invalid');
    attempts -= 1;

    if (value === secret) {
      renderResult(guessResult, `Acertou! O número era ${secret}. Clique em "Novo jogo" para jogar novamente.`);
      guessBtn.disabled = true;
      return;
    }

    if (attempts <= 0) {
      renderResult(guessResult, `Fim de jogo! O número era ${secret}. Clique em "Novo jogo".`);
      guessBtn.disabled = true;
      return;
    }

    const hint = value > secret ? 'menor' : 'maior';
    renderResult(guessResult, `Errou! Tente um número ${hint}. Tentativas restantes: ${attempts}.`);
  }

  guessBtn.addEventListener('click', checkGuess);
  guessReset.addEventListener('click', resetGuess);
}

function randomSecret() {
  return Math.floor(Math.random() * 100) + 1;
}

export function validateInput(value) {
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    return { valid: false, message: buildErrorMessage('digite um número inteiro entre 1 e 100.') };
  }

  return { valid: true, message: '' };
}

export function renderResult(target, message) {
  target.textContent = message;
}
