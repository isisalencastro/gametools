import { copyToClipboard, fetchWithTimeout, formatNumber, setLiveRegion } from '../common/utils.js';

const SUPPORTED_CURRENCIES = [
  'BRL', 'USD', 'EUR', 'GBP', 'JPY', 'ARS', 'AUD', 'CAD', 'CHF',
  'CNY', 'CZK', 'DKK', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK',
  'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK',
  'SGD', 'THB', 'TRY', 'ZAR',
];

const CURRENCY_NAMES = {
  BRL: 'Real brasileiro', USD: 'Dólar americano', EUR: 'Euro', GBP: 'Libra esterlina',
  JPY: 'Iene japonês', ARS: 'Peso argentino', AUD: 'Dólar australiano', CAD: 'Dólar canadense',
  CHF: 'Franco suíço', CNY: 'Yuan chinês', CZK: 'Coroa tcheca', DKK: 'Coroa dinamarquesa',
  HKD: 'Dólar de Hong Kong', HUF: 'Florim húngaro', IDR: 'Rupia indonésia', ILS: 'Shekel israelense',
  INR: 'Rupia indiana', ISK: 'Coroa islandesa', KRW: 'Won sul-coreano', MXN: 'Peso mexicano',
  MYR: 'Ringgit malaio', NOK: 'Coroa norueguesa', NZD: 'Dólar neozelandês', PHP: 'Peso filipino',
  PLN: 'Zlóti polonês', RON: 'Leu romeno', SEK: 'Coroa sueca', SGD: 'Dólar de Singapura',
  THB: 'Baht tailandês', TRY: 'Lira turca', ZAR: 'Rand sul-africano',
};

const API_BASE = 'https://api.frankfurter.app';
let rateCache = {};

function populateSelect(selectEl, defaultValue) {
  selectEl.innerHTML = '';
  for (const code of SUPPORTED_CURRENCIES) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${code} – ${CURRENCY_NAMES[code] || code}`;
    if (code === defaultValue) opt.selected = true;
    selectEl.appendChild(opt);
  }
}

async function fetchRate(from, to) {
  if (from === to) return 1;

  const cacheKey = `${from}_${to}`;
  const cached = rateCache[cacheKey];
  if (cached && Date.now() - cached.ts < 10 * 60 * 1000) {
    return cached.rate;
  }

  const resp = await fetchWithTimeout(`${API_BASE}/latest?from=${from}&to=${to}`);
  const data = await resp.json();
  const rate = data.rates?.[to];
  if (typeof rate !== 'number') throw new Error('Taxa indisponível');

  rateCache[cacheKey] = { rate, ts: Date.now() };
  return rate;
}

export function initCurrencyConverterFeature() {
  const resultado = document.getElementById('resultado');
  const valorInput = document.getElementById('valor');
  const taxaInput = document.getElementById('taxa');
  const origemInput = document.getElementById('origem');
  const destinoInput = document.getElementById('destino');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');
  const buscarTaxa = document.getElementById('buscar-taxa');
  const rateInfo = document.getElementById('rate-info');
  const inverter = document.getElementById('inverter');

  if (!resultado || !valorInput || !origemInput || !destinoInput || !calcular || !copiar) return;

  setLiveRegion(resultado);

  const isSelectMode = origemInput.tagName === 'SELECT';
  if (isSelectMode) {
    populateSelect(origemInput, 'BRL');
    populateSelect(destinoInput, 'USD');
  }

  const limite = 1e12;

  function valNum(inputElement, nome) {
    const raw = inputElement.value.trim();
    if (raw === '') return `${nome}: campo obrigatório.`;
    const n = Number(raw);
    if (!Number.isFinite(n) || Number.isNaN(n)) return `${nome}: valor inválido.`;
    if (n <= 0) return `${nome}: deve ser maior que zero.`;
    if (n > limite) return `${nome}: máximo permitido é ${formatNumber(limite, 'pt-BR', 0)}.`;
    return n;
  }

  async function buscarTaxaAPI() {
    const from = origemInput.value.trim().toUpperCase();
    const to = destinoInput.value.trim().toUpperCase();

    if (!from || !to) {
      resultado.textContent = 'Selecione moeda de origem e destino.';
      return;
    }

    if (rateInfo) rateInfo.innerHTML = 'Buscando cotação… <span class="currency-loading"></span>';
    try {
      const rate = await fetchRate(from, to);
      if (taxaInput) taxaInput.value = rate;
      if (rateInfo) rateInfo.textContent = `Cotação ao vivo: 1 ${from} = ${formatNumber(rate, 'pt-BR', 6)} ${to} (via frankfurter.app)`;
    } catch {
      if (rateInfo) rateInfo.textContent = 'Não foi possível obter cotação. Use a taxa manual.';
    }
  }

  if (buscarTaxa) {
    buscarTaxa.addEventListener('click', buscarTaxaAPI);
  }

  if (inverter) {
    inverter.addEventListener('click', () => {
      const tmpOrig = origemInput.value;
      if (isSelectMode) {
        origemInput.value = destinoInput.value;
        destinoInput.value = tmpOrig;
      } else {
        origemInput.value = destinoInput.value;
        destinoInput.value = tmpOrig;
      }
      if (taxaInput && taxaInput.value) {
        const currentRate = Number(taxaInput.value);
        if (Number.isFinite(currentRate) && currentRate > 0) {
          taxaInput.value = (1 / currentRate).toFixed(6);
        }
      }
      if (rateInfo) rateInfo.textContent = 'Moedas invertidas. Busque a cotação novamente ou use taxa manual.';
    });
  }

  calcular.addEventListener('click', () => {
    const valor = valNum(valorInput, 'Valor');
    if (taxaInput) {
      const taxa = valNum(taxaInput, 'Taxa');
      const origem = origemInput.value.trim().toUpperCase() || 'ORIGEM';
      const destino = destinoInput.value.trim().toUpperCase() || 'DESTINO';

      if (typeof valor === 'string' || typeof taxa === 'string') {
        resultado.textContent = [valor, taxa].filter((v) => typeof v === 'string').join(' ');
        return;
      }

      const convertido = valor * taxa;
      resultado.textContent = `${formatNumber(valor)} ${origem} = ${formatNumber(convertido)} ${destino}`;
    }
  });

  copiar.addEventListener('click', () => {
    copyToClipboard(resultado.textContent, copiar);
  });
}
