export function initCurrencyConverterFeature() {
  const resultado = document.getElementById('resultado');
  const valorInput = document.getElementById('valor');
  const taxaInput = document.getElementById('taxa');
  const origemInput = document.getElementById('origem');
  const destinoInput = document.getElementById('destino');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');

  if (!resultado || !valorInput || !taxaInput || !origemInput || !destinoInput || !calcular || !copiar) return;

  const limite = 1e9;

  function valNum(inputElement, nome) {
    const raw = inputElement.value.trim();
    if (raw === '') return `${nome}: campo obrigatório.`;
    const n = Number(raw);
    if (!Number.isFinite(n) || Number.isNaN(n)) return `${nome}: valor inválido.`;
    if (n <= 0) return `${nome}: deve ser maior que zero.`;
    if (n > limite) return `${nome}: máximo permitido é ${limite}.`;
    return n;
  }

  calcular.addEventListener('click', () => {
    const valor = valNum(valorInput, 'Valor');
    const taxa = valNum(taxaInput, 'Taxa');
    const origem = origemInput.value.trim().toUpperCase() || 'ORIGEM';
    const destino = destinoInput.value.trim().toUpperCase() || 'DESTINO';

    if (typeof valor === 'string' || typeof taxa === 'string') {
      resultado.textContent = [valor, taxa].filter((v) => typeof v === 'string').join(' ');
      return;
    }

    const convertido = valor * taxa;
    resultado.textContent = `Resultado: ${valor.toFixed(2)} ${origem} = ${convertido.toFixed(2)} ${destino}.`;
  });

  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultado.textContent);
      resultado.textContent += ' (Resultado copiado!)';
    } catch {
      resultado.textContent += ' (Falha ao copiar automaticamente.)';
    }
  });
}
