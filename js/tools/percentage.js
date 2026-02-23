// Módulo de porcentagem: interpreta entradas numéricas e exibe cálculo formatado.
import { buildErrorMessage, formatFixed, parseNumericInput, setLiveRegion } from '../common/utils.js';

export function initPercentageFeature() {
  const pctValue = document.getElementById('pct-value');
  const pctPercent = document.getElementById('pct-percent');
  const pctBtn = document.getElementById('pct-btn');
  const pctResult = document.getElementById('pct-result');

  if (!pctValue || !pctPercent || !pctBtn || !pctResult) return;

  setLiveRegion(pctResult);

  pctBtn.addEventListener('click', () => {
    const value = parseNumericInput(pctValue);
    const percent = parseNumericInput(pctPercent);
    const validation = validateInput(value, percent);

    if (!validation.valid) {
      renderResult(pctResult, validation.message);
      return;
    }

    const result = (value * percent) / 100;
    renderResult(pctResult, `${percent}% de ${value} = ${formatFixed(result)}.`);
  });
}

export function validateInput(value, percent) {
  if (Number.isNaN(value) || Number.isNaN(percent)) {
    return {
      valid: false,
      message: buildErrorMessage('informe valor e porcentagem numéricos.'),
    };
  }

  return { valid: true, message: '' };
}

export function renderResult(target, message) {
  target.textContent = message;
}
