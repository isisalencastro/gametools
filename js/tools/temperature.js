import { buildErrorMessage, copyToClipboard, formatFixed, parseNumericInput, setLiveRegion } from '../common/utils.js';

const CONVERSIONS = {
  c_f: (v) => v * 1.8 + 32,
  f_c: (v) => (v - 32) / 1.8,
  c_k: (v) => v + 273.15,
  k_c: (v) => v - 273.15,
  f_k: (v) => (v - 32) / 1.8 + 273.15,
  k_f: (v) => (v - 273.15) * 1.8 + 32,
};

const UNIT_NAMES = { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' };

export function initTemperatureFeature() {
  const tempValue = document.getElementById('temp-value');
  const tempFrom = document.getElementById('temp-from');
  const tempTo = document.getElementById('temp-to');
  const tempBtn = document.getElementById('temp-btn');
  const tempResult = document.getElementById('temp-result');
  const tempCopy = document.getElementById('temp-copy');

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
        `${formatFixed(value, 2)}° ${UNIT_NAMES[from]} = ${formatFixed(value, 2)}° ${UNIT_NAMES[to]}.`,
      );
      return;
    }

    const key = `${from}_${to}`;
    const converter = CONVERSIONS[key];
    if (!converter) {
      renderResult(tempResult, buildErrorMessage('conversão não suportada.'));
      return;
    }

    const converted = converter(value);
    renderResult(
      tempResult,
      `${formatFixed(value, 2)}° ${UNIT_NAMES[from]} = ${formatFixed(converted, 2)}° ${UNIT_NAMES[to]}.`,
    );
  });

  if (tempCopy) {
    tempCopy.addEventListener('click', () => {
      copyToClipboard(tempResult.textContent, tempCopy);
    });
  }
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
