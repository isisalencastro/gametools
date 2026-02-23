export function initIdadeExataFeature() {
  const resultado = document.getElementById('resultado');
  const nascimentoInput = document.getElementById('nascimento');
  const referenciaInput = document.getElementById('referencia');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');

  if (!resultado || !nascimentoInput || !referenciaInput || !calcular || !copiar) return;

  function diasNoMes(ano, mesIndex) {
    return new Date(ano, mesIndex + 1, 0).getDate();
  }

  calcular.addEventListener('click', () => {
    const nascRaw = nascimentoInput.value;
    const refRaw = referenciaInput.value;

    if (!nascRaw || !refRaw) {
      resultado.textContent = 'Preencha as duas datas.';
      return;
    }

    const nasc = new Date(`${nascRaw}T00:00:00`);
    const ref = new Date(`${refRaw}T00:00:00`);

    if (!Number.isFinite(nasc.getTime()) || !Number.isFinite(ref.getTime())) {
      resultado.textContent = 'Data inválida.';
      return;
    }

    if (nasc > ref) {
      resultado.textContent = 'A data de nascimento não pode ser maior que a data de referência.';
      return;
    }

    let anos = ref.getFullYear() - nasc.getFullYear();
    let meses = ref.getMonth() - nasc.getMonth();
    let dias = ref.getDate() - nasc.getDate();

    if (dias < 0) {
      meses -= 1;
      const mesAnterior = ref.getMonth() === 0 ? 11 : ref.getMonth() - 1;
      const anoMesAnterior = ref.getMonth() === 0 ? ref.getFullYear() - 1 : ref.getFullYear();
      dias += diasNoMes(anoMesAnterior, mesAnterior);
    }

    if (meses < 0) {
      anos -= 1;
      meses += 12;
    }

    resultado.textContent = `Idade exata: ${anos} ano(s), ${meses} mês(es) e ${dias} dia(s). Lógica: diferença entre datas com ajuste de empréstimo de mês/dia.`;
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
