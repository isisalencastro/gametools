// Módulo de temperatura: converte entre escalas C/F com validação simples.
import { buildErrorMessage, formatFixed, parseNumericInput, setLiveRegion } from '../common/utils.js';

export function initTemperatureFeature() {
  const tempValue = document.getElementById('temp-value');
  const tempFrom = document.getElementById('temp-from');
  const tempTo = document.getElementById('temp-to');
  const tempBtn = document.getElementById('temp-btn');
  const tempResult = document.getElementById('temp-result');

  if (!tempValue || !tempFrom || !tempTo || !tempBtn || !tempResult) return;

  setLiveRegion(tempResult);

  tempBtn.addEventListener('click', () => {
    const value = parseNumericInput(tempValue);
    const from = tempFrom.value;
    const to = tempTo.value;
    const validation = validateInput(value);

    if (!validation.valid) {
      renderResult(tempResult, validation.message);
      return;
    }

    if (from === to) {
      renderResult(
        tempResult,
        `${formatFixed(value, 1)}° ${from.toUpperCase()} = ${formatFixed(value, 1)}° ${to.toUpperCase()}.`,
      );
      return;
    }

    let converted = value;
    if (from === 'c' && to === 'f') converted = value * 1.8 + 32;
    if (from === 'f' && to === 'c') converted = (value - 32) / 1.8;

    renderResult(
      tempResult,
      `${formatFixed(value, 1)}° ${from.toUpperCase()} = ${formatFixed(converted, 1)}° ${to.toUpperCase()}.`,
    );
  });
}

export function validateInput(value) {
  if (Number.isNaN(value)) {
    return {
      valid: false,
      message: buildErrorMessage('digite um valor numérico para converter.'),
    };
  }

  return { valid: true, message: '' };
}

export function renderResult(target, message) {
  target.textContent = message;
}
