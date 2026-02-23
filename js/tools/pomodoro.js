export function initPomodoroFeature() {
  const focoInput = document.getElementById('foco');
  const pausaInput = document.getElementById('pausa');
  const iniciar = document.getElementById('iniciar');
  const pausar = document.getElementById('pausar');
  const resetar = document.getElementById('resetar');
  const copiar = document.getElementById('copiar');
  const timerEl = document.getElementById('timer');
  const resultado = document.getElementById('resultado');

  if (!focoInput || !pausaInput || !iniciar || !pausar || !resetar || !copiar || !timerEl || !resultado) return;

  let segundosRestantes = 25 * 60;
  let emFoco = true;
  let intervalo = null;

  function dois(n) {
    return String(n).padStart(2, '0');
  }

  function desenhar() {
    const m = Math.floor(segundosRestantes / 60);
    const s = segundosRestantes % 60;
    timerEl.textContent = `${dois(m)}:${dois(s)}`;
  }

  function lerFaixa(inputElement, nome, min, max) {
    const n = Number(inputElement.value);
    if (!Number.isFinite(n) || Number.isNaN(n)) return `${nome}: inválido.`;
    if (n < min || n > max) return `${nome}: use de ${min} a ${max}.`;
    return Math.floor(n);
  }

  function aplicarInicio(estadoFoco) {
    const foco = lerFaixa(focoInput, 'Foco', 1, 180);
    const pausa = lerFaixa(pausaInput, 'Pausa', 1, 60);

    if (typeof foco === 'string' || typeof pausa === 'string') {
      resultado.textContent = [foco, pausa].filter((v) => typeof v === 'string').join(' ');
      return false;
    }

    emFoco = estadoFoco;
    segundosRestantes = (emFoco ? foco : pausa) * 60;
    resultado.textContent = `Modo atual: ${emFoco ? 'foco' : 'pausa'}. Duração configurada: ${emFoco ? foco : pausa} min.`;
    desenhar();
    return true;
  }

  iniciar.addEventListener('click', () => {
    if (intervalo) return;
    if (!aplicarInicio(emFoco) && segundosRestantes <= 0) return;

    intervalo = setInterval(() => {
      segundosRestantes -= 1;
      desenhar();

      if (segundosRestantes <= 0) {
        clearInterval(intervalo);
        intervalo = null;
        emFoco = !emFoco;
        aplicarInicio(emFoco);
        resultado.textContent += ' Ciclo concluído!';
      }
    }, 1000);
  });

  pausar.addEventListener('click', () => {
    clearInterval(intervalo);
    intervalo = null;
    resultado.textContent += ' Cronômetro pausado.';
  });

  resetar.addEventListener('click', () => {
    clearInterval(intervalo);
    intervalo = null;
    emFoco = true;
    aplicarInicio(true);
  });

  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`${timerEl.textContent} - ${resultado.textContent}`);
      resultado.textContent += ' (Resultado copiado!)';
    } catch {
      resultado.textContent += ' (Falha ao copiar automaticamente.)';
    }
  });

  desenhar();
}
