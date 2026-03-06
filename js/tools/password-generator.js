import { copyToClipboard } from '../common/utils.js';

const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const GUESSES_PER_SECOND = 10_000_000_000;

const STRENGTH_LEVELS = [
  { maxBits: 28,  label: 'Muito fraca',  color: '#ef4444', icon: '💀', tip: 'Quebrada instantaneamente' },
  { maxBits: 36,  label: 'Fraca',        color: '#f97316', icon: '⚠️', tip: 'Evite usar esta senha' },
  { maxBits: 60,  label: 'Razoável',     color: '#eab308', icon: '🟡', tip: 'Aceitável para contas simples' },
  { maxBits: 80,  label: 'Forte',        color: '#22c55e', icon: '🟢', tip: 'Boa para a maioria dos usos' },
  { maxBits: 128, label: 'Muito forte',  color: '#3b82f6', icon: '🛡️', tip: 'Excelente segurança' },
  { maxBits: Infinity, label: 'Extrema', color: '#8b5cf6', icon: '🔒', tip: 'Nível militar de proteção' },
];

function getStrength(bits) {
  for (const level of STRENGTH_LEVELS) {
    if (bits < level.maxBits) return level;
  }
  return STRENGTH_LEVELS[STRENGTH_LEVELS.length - 1];
}

function calcEntropy(length, poolSize) {
  if (poolSize <= 0 || length <= 0) return 0;
  return length * Math.log2(poolSize);
}

function crackTimeSeconds(entropyBits) {
  if (entropyBits <= 0) return 0;
  const combinations = Math.pow(2, entropyBits);
  return combinations / (GUESSES_PER_SECOND * 2);
}

function formatCrackTime(seconds) {
  if (seconds < 0.001) return 'instantaneamente';
  if (seconds < 1) return 'menos de 1 segundo';
  if (seconds < 60) return `${Math.floor(seconds)} segundo${Math.floor(seconds) !== 1 ? 's' : ''}`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minuto${Math.floor(seconds / 60) !== 1 ? 's' : ''}`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hora${Math.floor(seconds / 3600) !== 1 ? 's' : ''}`;
  if (seconds < 31_536_000) return `${Math.floor(seconds / 86400)} dia${Math.floor(seconds / 86400) !== 1 ? 's' : ''}`;

  const years = seconds / 31_536_000;
  if (years < 1000) return `${Math.floor(years)} ano${Math.floor(years) !== 1 ? 's' : ''}`;
  if (years < 1_000_000) return `${Math.floor(years / 1000)} mil anos`;
  if (years < 1_000_000_000) return `${Math.floor(years / 1_000_000)} milhões de anos`;
  if (years < 1_000_000_000_000) return `${Math.floor(years / 1_000_000_000)} bilhões de anos`;
  return `${Math.floor(years / 1_000_000_000_000)} trilhões de anos`;
}

function generatePassword(length, pool) {
  if (!pool || length <= 0) return '';
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += pool[arr[i] % pool.length];
  }
  return pwd;
}

function ensureAllCharsets(password, enabledSets) {
  const chars = [...password];
  const arr = new Uint32Array(enabledSets.length);
  crypto.getRandomValues(arr);

  enabledSets.forEach((setKey, idx) => {
    const charset = CHARSETS[setKey];
    const hasChar = chars.some(c => charset.includes(c));
    if (!hasChar) {
      const pos = arr[idx] % chars.length;
      const randIdx = new Uint32Array(1);
      crypto.getRandomValues(randIdx);
      chars[pos] = charset[randIdx[0] % charset.length];
    }
  });

  return chars.join('');
}

export function initPasswordGeneratorFeature() {
  const lengthSlider = document.getElementById('pwd-length');
  const lengthValue = document.getElementById('pwd-length-value');
  const toggleLower = document.getElementById('pwd-lower');
  const toggleUpper = document.getElementById('pwd-upper');
  const toggleDigits = document.getElementById('pwd-digits');
  const toggleSymbols = document.getElementById('pwd-symbols');
  const generateBtn = document.getElementById('pwd-generate');
  const copyBtn = document.getElementById('pwd-copy');
  const passwordDisplay = document.getElementById('pwd-display');
  const entropyText = document.getElementById('pwd-entropy');
  const crackTimeText = document.getElementById('pwd-crack-time');
  const strengthLabel = document.getElementById('pwd-strength-label');
  const strengthBar = document.getElementById('pwd-strength-bar');
  const strengthTip = document.getElementById('pwd-strength-tip');
  const strengthIcon = document.getElementById('pwd-strength-icon');

  if (!lengthSlider || !generateBtn || !passwordDisplay) return;

  function getEnabledSets() {
    const sets = [];
    if (toggleLower?.checked) sets.push('lower');
    if (toggleUpper?.checked) sets.push('upper');
    if (toggleDigits?.checked) sets.push('digits');
    if (toggleSymbols?.checked) sets.push('symbols');
    return sets;
  }

  function buildPool(sets) {
    return sets.map(s => CHARSETS[s]).join('');
  }

  function updateLengthDisplay() {
    if (lengthValue) lengthValue.textContent = lengthSlider.value;
  }

  function updateStrengthUI(entropyBits) {
    const strength = getStrength(entropyBits);
    const seconds = crackTimeSeconds(entropyBits);
    const timeStr = formatCrackTime(seconds);

    if (entropyText) entropyText.textContent = `${Math.floor(entropyBits)} bits de entropia`;
    if (crackTimeText) crackTimeText.innerHTML = `Tempo estimado para quebra: <strong>${timeStr}</strong>`;
    if (strengthLabel) {
      strengthLabel.textContent = strength.label;
      strengthLabel.style.color = strength.color;
    }
    if (strengthIcon) strengthIcon.textContent = strength.icon;
    if (strengthTip) strengthTip.textContent = strength.tip;
    if (strengthBar) {
      const pct = Math.min(100, (entropyBits / 128) * 100);
      strengthBar.style.width = `${pct}%`;
      strengthBar.style.background = strength.color;
    }
  }

  function generate() {
    const length = Number(lengthSlider.value);
    const enabledSets = getEnabledSets();

    if (enabledSets.length === 0) {
      passwordDisplay.textContent = 'Selecione ao menos um tipo de caractere.';
      passwordDisplay.className = 'pwd-display pwd-display-empty';
      updateStrengthUI(0);
      return;
    }

    const pool = buildPool(enabledSets);
    let password = generatePassword(length, pool);
    if (length >= enabledSets.length) {
      password = ensureAllCharsets(password, enabledSets);
    }

    passwordDisplay.textContent = password;
    passwordDisplay.className = 'pwd-display';

    const entropy = calcEntropy(length, pool.length);
    updateStrengthUI(entropy);
  }

  lengthSlider.addEventListener('input', () => {
    updateLengthDisplay();
    generate();
  });

  [toggleLower, toggleUpper, toggleDigits, toggleSymbols].forEach(toggle => {
    if (toggle) toggle.addEventListener('change', generate);
  });

  generateBtn.addEventListener('click', generate);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const pwd = passwordDisplay.textContent;
      if (!pwd || pwd === 'Selecione ao menos um tipo de caractere.') return;
      copyToClipboard(pwd, copyBtn);
    });
  }

  updateLengthDisplay();
  generate();
}
