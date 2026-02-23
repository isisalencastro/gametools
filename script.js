// Teste de reação
const reactionStart = document.getElementById('reaction-start');
const reactionBox = document.getElementById('reaction-box');
const reactionResult = document.getElementById('reaction-result');

let reactionTimer;
let reactionStartedAt = 0;
let canClickReaction = false;

reactionStart.addEventListener('click', () => {
  clearTimeout(reactionTimer);
  canClickReaction = false;
  reactionBox.style.background = '#e2e8f0';
  reactionBox.textContent = 'Aguarde o verde...';
  reactionResult.textContent = 'Preparando...';

  const delay = 1000 + Math.random() * 2500;
  reactionTimer = setTimeout(() => {
    canClickReaction = true;
    reactionStartedAt = performance.now();
    reactionBox.style.background = '#22c55e';
    reactionBox.textContent = 'CLIQUE!';
  }, delay);
});

reactionBox.addEventListener('click', () => {
  if (!canClickReaction) {
    reactionResult.textContent = 'Ainda não! Aguarde o verde.';
    return;
  }

  const elapsed = Math.round(performance.now() - reactionStartedAt);
  canClickReaction = false;
  reactionBox.style.background = '#e2e8f0';
  reactionBox.textContent = 'Aguardando...';
  reactionResult.textContent = `Seu tempo de reação foi ${elapsed} ms.`;
});

// Adivinhe o número
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const guessReset = document.getElementById('guess-reset');
const guessResult = document.getElementById('guess-result');

let secret = randomSecret();
let attempts = 10;

function randomSecret() {
  return Math.floor(Math.random() * 100) + 1;
}

function resetGuess() {
  secret = randomSecret();
  attempts = 10;
  guessResult.textContent = 'Você tem 10 tentativas.';
  guessInput.value = '';
}

function checkGuess() {
  const value = Number(guessInput.value);

  if (!value || value < 1 || value > 100) {
    guessResult.textContent = 'Digite um número válido entre 1 e 100.';
    return;
  }

  attempts -= 1;

  if (value === secret) {
    guessResult.textContent = `Acertou! O número era ${secret}.`;
    return;
  }

  if (attempts <= 0) {
    guessResult.textContent = `Fim de jogo! O número era ${secret}. Clique em "Novo jogo".`;
    return;
  }

  const hint = value > secret ? 'menor' : 'maior';
  guessResult.textContent = `Errou! Tente um número ${hint}. Tentativas restantes: ${attempts}.`;
}

guessBtn.addEventListener('click', checkGuess);
guessReset.addEventListener('click', resetGuess);

// IMC
const imcHeight = document.getElementById('imc-height');
const imcWeight = document.getElementById('imc-weight');
const imcBtn = document.getElementById('imc-btn');
const imcResult = document.getElementById('imc-result');

function imcCategory(imc) {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}

imcBtn.addEventListener('click', () => {
  const h = Number(imcHeight.value);
  const w = Number(imcWeight.value);

  if (!h || !w || h <= 0 || w <= 0) {
    imcResult.textContent = 'Preencha altura e peso com valores válidos.';
    return;
  }

  const imc = w / (h * h);
  imcResult.textContent = `IMC: ${imc.toFixed(2)} · ${imcCategory(imc)}.`;
});

// Porcentagem
const pctValue = document.getElementById('pct-value');
const pctPercent = document.getElementById('pct-percent');
const pctBtn = document.getElementById('pct-btn');
const pctResult = document.getElementById('pct-result');

pctBtn.addEventListener('click', () => {
  const value = Number(pctValue.value);
  const percent = Number(pctPercent.value);

  if (Number.isNaN(value) || Number.isNaN(percent)) {
    pctResult.textContent = 'Informe os dois valores.';
    return;
  }

  const result = (value * percent) / 100;
  pctResult.textContent = `${percent}% de ${value} = ${result.toFixed(2)}.`;
});

// Temperatura
const tempValue = document.getElementById('temp-value');
const tempFrom = document.getElementById('temp-from');
const tempTo = document.getElementById('temp-to');
const tempBtn = document.getElementById('temp-btn');
const tempResult = document.getElementById('temp-result');

tempBtn.addEventListener('click', () => {
  const value = Number(tempValue.value);
  const from = tempFrom.value;
  const to = tempTo.value;

  if (Number.isNaN(value)) {
    tempResult.textContent = 'Digite um valor numérico.';
    return;
  }

  if (from === to) {
    tempResult.textContent = `${value.toFixed(1)}° ${from.toUpperCase()} = ${value.toFixed(1)}° ${to.toUpperCase()}.`;
    return;
  }

  let converted = value;

  if (from === 'c' && to === 'f') converted = value * 1.8 + 32;
  if (from === 'f' && to === 'c') converted = (value - 32) / 1.8;

  tempResult.textContent = `${value.toFixed(1)}° ${from.toUpperCase()} = ${converted.toFixed(1)}° ${to.toUpperCase()}.`;
});
