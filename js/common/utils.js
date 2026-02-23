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
