// Utilitários compartilhados para parsing numérico, mensagens e acessibilidade.
export function setLiveRegion(element) {
  if (!element) return;
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('role', 'status');
}

export function parseNumericInput(inputElement) {
  if (!inputElement) return Number.NaN;
  return Number(inputElement.value);
}

export function formatFixed(value, digits = 2) {
  return Number(value).toFixed(digits);
}

export function buildErrorMessage(message) {
  return `Ação inválida: ${message}`;
}

export function formatCurrency(value, currency = 'BRL', locale = 'pt-BR') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${Number(value).toFixed(2)}`;
  }
}

export function formatNumber(value, locale = 'pt-BR', digits = 2) {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return Number(value).toFixed(digits);
  }
}

export function formatDateLong(date, locale = 'pt-BR') {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

export async function copyToClipboard(text, feedbackEl) {
  try {
    await navigator.clipboard.writeText(text);
    if (feedbackEl) showToast(feedbackEl, 'Copiado!');
    return true;
  } catch {
    if (feedbackEl) showToast(feedbackEl, 'Falha ao copiar.');
    return false;
  }
}

export function showToast(targetEl, message, durationMs = 2500) {
  let toast = targetEl.parentElement?.querySelector('.toast-msg');
  if (toast) {
    toast.remove();
  }
  toast = document.createElement('span');
  toast.className = 'toast-msg';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  targetEl.insertAdjacentElement('afterend', toast);
  setTimeout(() => toast.remove(), durationMs);
}

export function debounce(fn, delayMs = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
