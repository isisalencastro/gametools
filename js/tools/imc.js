import { buildErrorMessage, copyToClipboard, formatFixed, parseNumericInput, setLiveRegion } from '../common/utils.js';

const IMC_CATEGORIES = [
  { max: 16, label: 'Magreza grau III (grave)', color: '#3b82f6' },
  { max: 17, label: 'Magreza grau II (moderada)', color: '#60a5fa' },
  { max: 18.5, label: 'Magreza grau I (leve)', color: '#93c5fd' },
  { max: 25, label: 'Peso normal', color: '#22c55e' },
  { max: 30, label: 'Sobrepeso', color: '#eab308' },
  { max: 35, label: 'Obesidade grau I', color: '#f97316' },
  { max: 40, label: 'Obesidade grau II', color: '#ef4444' },
  { max: Infinity, label: 'Obesidade grau III (mórbida)', color: '#dc2626' },
];

function imcCategory(imc) {
  for (const cat of IMC_CATEGORIES) {
    if (imc < cat.max) return cat;
  }
  return IMC_CATEGORIES[IMC_CATEGORIES.length - 1];
}

function imcBarPercent(imc) {
  const min = 10;
  const max = 45;
  return Math.max(0, Math.min(100, ((imc - min) / (max - min)) * 100));
}

function idealWeightRange(heightM) {
  const low = 18.5 * heightM * heightM;
  const high = 24.9 * heightM * heightM;
  return { low, high };
}

export function initImcFeature() {
  const imcHeight = document.getElementById('imc-height');
  const imcWeight = document.getElementById('imc-weight');
  const imcBtn = document.getElementById('imc-btn');
  const imcResult = document.getElementById('imc-result');
  const imcBar = document.getElementById('imc-bar');
  const imcMarker = document.getElementById('imc-marker');
  const imcExtra = document.getElementById('imc-extra');
  const imcCopy = document.getElementById('imc-copy');

  if (!imcHeight || !imcWeight || !imcBtn || !imcResult) return;

  setLiveRegion(imcResult);

  imcBtn.addEventListener('click', () => {
    const height = parseNumericInput(imcHeight);
    const weight = parseNumericInput(imcWeight);
    const validation = validateInput(height, weight);

    if (!validation.valid) {
      renderResult(imcResult, validation.message);
      if (imcBar) imcBar.hidden = true;
      if (imcExtra) imcExtra.textContent = '';
      return;
    }

    const imc = weight / (height * height);
    const cat = imcCategory(imc);
    renderResult(imcResult, `IMC: ${formatFixed(imc)} · ${cat.label}.`);

    if (imcBar && imcMarker) {
      imcBar.hidden = false;
      imcMarker.style.left = `${imcBarPercent(imc)}%`;
    }

    if (imcExtra) {
      const range = idealWeightRange(height);
      imcExtra.innerHTML =
        `<strong>Faixa de peso ideal</strong> (IMC 18,5–24,9): ${formatFixed(range.low)} kg a ${formatFixed(range.high)} kg.`;
    }
  });

  if (imcCopy) {
    imcCopy.addEventListener('click', () => {
      const text = `${imcResult.textContent} ${imcExtra?.textContent || ''}`.trim();
      copyToClipboard(text, imcCopy);
    });
  }
}

export function validateInput(height, weight) {
  const errors = [];

  if (Number.isNaN(height) || height <= 0) {
    errors.push('altura deve ser um valor positivo');
  } else if (height < 0.3 || height > 2.8) {
    errors.push('altura fora da faixa realista (0,30 m a 2,80 m)');
  }

  if (Number.isNaN(weight) || weight <= 0) {
    errors.push('peso deve ser um valor positivo');
  } else if (weight < 1 || weight > 600) {
    errors.push('peso fora da faixa realista (1 kg a 600 kg)');
  }

  if (errors.length > 0) {
    return { valid: false, message: buildErrorMessage(errors.join('; ') + '.') };
  }

  return { valid: true, message: '' };
}

export function renderResult(target, message) {
  target.textContent = message;
}
