import { copyToClipboard, formatDateLong, formatNumber, setLiveRegion } from '../common/utils.js';

const ZODIAC_SIGNS = [
  { name: 'Capricórnio', start: [1, 1], end: [1, 19] },
  { name: 'Aquário', start: [1, 20], end: [2, 18] },
  { name: 'Peixes', start: [2, 19], end: [3, 20] },
  { name: 'Áries', start: [3, 21], end: [4, 19] },
  { name: 'Touro', start: [4, 20], end: [5, 20] },
  { name: 'Gêmeos', start: [5, 21], end: [6, 20] },
  { name: 'Câncer', start: [6, 21], end: [7, 22] },
  { name: 'Leão', start: [7, 23], end: [8, 22] },
  { name: 'Virgem', start: [8, 23], end: [9, 22] },
  { name: 'Libra', start: [9, 23], end: [10, 22] },
  { name: 'Escorpião', start: [10, 23], end: [11, 21] },
  { name: 'Sagitário', start: [11, 22], end: [12, 21] },
  { name: 'Capricórnio', start: [12, 22], end: [12, 31] },
];

function getZodiacSign(month, day) {
  for (const sign of ZODIAC_SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) {
      return sign.name;
    }
  }
  return 'Capricórnio';
}

function getWeekdayName(date) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
  } catch {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return days[date.getDay()];
  }
}

function daysUntilNextBirthday(nasc, ref) {
  let nextBday = new Date(ref.getFullYear(), nasc.getMonth(), nasc.getDate());
  if (nextBday <= ref) {
    nextBday = new Date(ref.getFullYear() + 1, nasc.getMonth(), nasc.getDate());
  }
  const diffMs = nextBday.getTime() - ref.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function totalDaysBetween(d1, d2) {
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function diasNoMes(ano, mesIndex) {
  return new Date(ano, mesIndex + 1, 0).getDate();
}

export function initIdadeExataFeature() {
  const resultado = document.getElementById('resultado');
  const nascimentoInput = document.getElementById('nascimento');
  const referenciaInput = document.getElementById('referencia');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');
  const extraInfo = document.getElementById('idade-extra');

  if (!resultado || !nascimentoInput || !referenciaInput || !calcular || !copiar) return;

  setLiveRegion(resultado);

  const today = new Date();
  referenciaInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  calcular.addEventListener('click', () => {
    const nascRaw = nascimentoInput.value;
    const refRaw = referenciaInput.value;

    if (!nascRaw || !refRaw) {
      resultado.textContent = 'Preencha as duas datas.';
      if (extraInfo) extraInfo.innerHTML = '';
      return;
    }

    const nasc = new Date(`${nascRaw}T00:00:00`);
    const ref = new Date(`${refRaw}T00:00:00`);

    if (!Number.isFinite(nasc.getTime()) || !Number.isFinite(ref.getTime())) {
      resultado.textContent = 'Data inválida.';
      if (extraInfo) extraInfo.innerHTML = '';
      return;
    }

    if (nasc > ref) {
      resultado.textContent = 'A data de nascimento não pode ser maior que a data de referência.';
      if (extraInfo) extraInfo.innerHTML = '';
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

    resultado.textContent = `Idade exata: ${anos} ano(s), ${meses} mês(es) e ${dias} dia(s).`;

    if (extraInfo) {
      const totalDias = totalDaysBetween(nasc, ref);
      const totalSemanas = Math.floor(totalDias / 7);
      const totalHoras = totalDias * 24;
      const diaNascimento = getWeekdayName(nasc);
      const signo = getZodiacSign(nasc.getMonth() + 1, nasc.getDate());
      const diasProxAniversario = daysUntilNextBirthday(nasc, ref);
      const nascFormatted = formatDateLong(nasc);

      extraInfo.innerHTML =
        `<strong>Nascimento:</strong> ${nascFormatted} (${diaNascimento})<br>` +
        `<strong>Total vivido:</strong> ${formatNumber(totalDias, 'pt-BR', 0)} dias · ${formatNumber(totalSemanas, 'pt-BR', 0)} semanas · ${formatNumber(totalHoras, 'pt-BR', 0)} horas<br>` +
        `<strong>Signo:</strong> ${signo}<br>` +
        `<strong>Próximo aniversário:</strong> em ${diasProxAniversario} dia(s)`;
    }
  });

  copiar.addEventListener('click', () => {
    const text = `${resultado.textContent} ${extraInfo?.textContent || ''}`.trim();
    copyToClipboard(text, copiar);
  });
}
