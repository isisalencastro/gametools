import { buildErrorMessage, copyToClipboard, formatFixed, parseNumericInput, setLiveRegion } from '../common/utils.js';

export function initPercentageFeature() {
  const pctValue = document.getElementById('pct-value');
  const pctPercent = document.getElementById('pct-percent');
  const pctBtn = document.getElementById('pct-btn');
  const pctResult = document.getElementById('pct-result');
  const pctMode = document.getElementById('pct-mode');
  const pctCopy = document.getElementById('pct-copy');

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

    const mode = pctMode?.value || 'quanto';

    if (mode === 'quanto') {
      const result = (value * percent) / 100;
      renderResult(pctResult, `${percent}% de ${value} = ${formatFixed(result)}.`);
    } else if (mode === 'aumento') {
      const result = value * (1 + percent / 100);
      renderResult(pctResult, `${value} + ${percent}% = ${formatFixed(result)}.`);
    } else if (mode === 'desconto') {
      const result = value * (1 - percent / 100);
      renderResult(pctResult, `${value} − ${percent}% = ${formatFixed(result)}.`);
    } else if (mode === 'representa') {
      if (percent === 0) {
        renderResult(pctResult, buildErrorMessage('o segundo valor não pode ser zero para essa operação.'));
        return;
      }
      const result = (value / percent) * 100;
      renderResult(pctResult, `${value} representa ${formatFixed(result)}% de ${percent}.`);
    }
  });

  if (pctCopy) {
    pctCopy.addEventListener('click', () => {
      copyToClipboard(pctResult.textContent, pctCopy);
    });
  }
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
