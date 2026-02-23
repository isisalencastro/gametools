// Módulo de IMC: valida altura/peso, calcula índice e exibe classificação.
import { buildErrorMessage, formatFixed, parseNumericInput, setLiveRegion } from '../common/utils.js';

export function initImcFeature() {
  const imcHeight = document.getElementById('imc-height');
  const imcWeight = document.getElementById('imc-weight');
  const imcBtn = document.getElementById('imc-btn');
  const imcResult = document.getElementById('imc-result');

  if (!imcHeight || !imcWeight || !imcBtn || !imcResult) return;

  setLiveRegion(imcResult);

  imcBtn.addEventListener('click', () => {
    const height = parseNumericInput(imcHeight);
    const weight = parseNumericInput(imcWeight);
    const validation = validateInput(height, weight);

    if (!validation.valid) {
      renderResult(imcResult, validation.message);
      return;
    }

    const imc = weight / (height * height);
    renderResult(imcResult, `IMC: ${formatFixed(imc)} · ${imcCategory(imc)}.`);
  });
}

export function validateInput(height, weight) {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return {
      valid: false,
      message: buildErrorMessage('preencha altura e peso com valores positivos.'),
    };
  }

  return { valid: true, message: '' };
}

export function renderResult(target, message) {
  target.textContent = message;
}

function imcCategory(imc) {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}
