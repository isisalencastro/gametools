export function initJurosFeature() {
  const resultado = document.getElementById('resultado');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');
  const tipoInput = document.getElementById('tipo');
  const capitalInput = document.getElementById('capital');
  const taxaInput = document.getElementById('taxa');
  const tempoInput = document.getElementById('tempo');

  if (!resultado || !calcular || !copiar || !tipoInput || !capitalInput || !taxaInput || !tempoInput) return;

  const limite = 1e9;

  function lerPositivo(inputElement, nome) {
    const raw = inputElement.value.trim();
    if (raw === '') return `${nome}: campo obrigatório.`;
    const n = Number(raw);
    if (!Number.isFinite(n)) return `${nome}: valor inválido.`;
    if (n <= 0) return `${nome}: deve ser maior que zero.`;
    if (n > limite) return `${nome}: valor muito alto.`;
    return n;
  }

  calcular.addEventListener('click', () => {
    const tipo = tipoInput.value;
    const capital = lerPositivo(capitalInput, 'Capital');
    const taxa = lerPositivo(taxaInput, 'Taxa');
    const tempo = lerPositivo(tempoInput, 'Tempo');

    if (typeof capital === 'string' || typeof taxa === 'string' || typeof tempo === 'string') {
      resultado.textContent = [capital, taxa, tempo].filter((v) => typeof v === 'string').join(' ');
      return;
    }

    const i = taxa / 100;
    if (tipo === 'simples') {
      const juros = capital * i * tempo;
      const montante = capital + juros;
      resultado.textContent = `Juros simples: J = C × i × t = ${capital} × ${i.toFixed(4)} × ${tempo} = ${juros.toFixed(2)}. Montante: M = C + J = ${montante.toFixed(2)}.`;
      return;
    }

    const montante = capital * (1 + i) ** tempo;
    const juros = montante - capital;
    resultado.textContent = `Juros compostos: M = C × (1 + i)^t = ${capital} × (1 + ${i.toFixed(4)})^${tempo} = ${montante.toFixed(2)}. Juros: ${juros.toFixed(2)}.`;
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
