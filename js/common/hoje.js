// Painel "Hoje" da home: diz, para cada jogo diario, em que pe a pessoa esta hoje e quanto
// falta para os desafios novos. So le o que os proprios jogos ja guardam no navegador;
// nao grava nada. Sem armazenamento (navegador embutido), todo jogo aparece como novo.

const JOGOS = [
  { id: 'conta', chave: 'iba:conta-do-dia:v1' },
  { id: 'no', chave: 'iba:no-do-dia:v1' },
];

const TENTATIVAS_DA_CONTA = 6;

// O dia do jogo e o dia de Sao Paulo, igual nos dois jogos (ver no-do-dia.js).
function dataLocalIso(quando = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(quando);
  } catch {
    const ano = quando.getFullYear();
    const mes = String(quando.getMonth() + 1).padStart(2, '0');
    const dia = String(quando.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}

function ontemIso(hoje) {
  const data = new Date(`${hoje}T12:00:00`);
  data.setDate(data.getDate() - 1);
  return dataLocalIso(data);
}

function segundosAteMeiaNoite() {
  try {
    const partes = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const ler = (tipo) => Number(partes.find((parte) => parte.type === tipo)?.value || 0);
    return Math.max(0, 86400 - ((ler('hour') % 24) * 3600 + ler('minute') * 60 + ler('second')));
  } catch {
    const agora = new Date();
    return 86400 - (agora.getHours() * 3600 + agora.getMinutes() * 60 + agora.getSeconds());
  }
}

function lerGuardado(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave) || 'null') || {};
  } catch {
    return {};
  }
}

/** Situacao de hoje: `estado` vai para o atributo (cor do selo) e `texto` para a tela. */
function situacaoDeHoje(guardado, hoje) {
  if (guardado.ultimoDiaVitoria === hoje) return { estado: 'feito', texto: 'Resolvido hoje' };
  const progresso = guardado.progresso;
  if (progresso && progresso.dia === hoje) {
    if (progresso.perdeu) return { estado: 'encerrado', texto: 'Encerrado hoje' };
    const usadas = Array.isArray(progresso.tentativas) ? progresso.tentativas.length : 0;
    if (usadas > 0) {
      return { estado: 'andamento', texto: `${usadas} de ${TENTATIVAS_DA_CONTA} tentativas` };
    }
  }
  if (guardado.ultimoDia === hoje) return { estado: 'encerrado', texto: 'Resposta vista' };
  return { estado: 'novo', texto: 'Novo hoje' };
}

function sequenciaViva(guardado, hoje) {
  const viva = guardado.ultimoDiaVitoria === hoje || guardado.ultimoDiaVitoria === ontemIso(hoje);
  return viva ? guardado.sequencia || 0 : 0;
}

function formatarRelogio(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

export function initPainelHoje() {
  const root = document.querySelector('[data-hoje-root]');
  if (!root) return;

  const dataEl = root.querySelector('[data-hoje-data]');
  const relogio = root.querySelector('[data-hoje-relogio]');
  let hojeVisto = null;

  function pintarJogos() {
    const hoje = dataLocalIso();
    hojeVisto = hoje;

    if (dataEl) {
      try {
        dataEl.textContent = new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'America/Sao_Paulo', weekday: 'long', day: 'numeric', month: 'long',
        }).format(new Date());
      } catch {
        dataEl.textContent = hoje;
      }
    }

    JOGOS.forEach(({ id, chave }) => {
      const linha = root.querySelector(`[data-hoje-jogo="${id}"]`);
      if (!linha) return;
      const guardado = lerGuardado(chave);
      const situacao = situacaoDeHoje(guardado, hoje);
      const selo = linha.querySelector('[data-hoje-situacao]');
      if (selo) {
        selo.textContent = situacao.texto;
        selo.dataset.estado = situacao.estado;
      }
      const sequencia = linha.querySelector('[data-hoje-sequencia]');
      if (sequencia) {
        const dias = sequenciaViva(guardado, hoje);
        sequencia.textContent = dias > 0 ? `Sequência de ${dias} ${dias === 1 ? 'dia' : 'dias'}` : '';
      }
    });
  }

  function tique() {
    if (relogio) relogio.textContent = formatarRelogio(segundosAteMeiaNoite());
    // Virou o dia com a pagina aberta: os selos voltam para "Novo hoje" sozinhos.
    if (dataLocalIso() !== hojeVisto) pintarJogos();
  }

  pintarJogos();
  tique();
  setInterval(tique, 1000);

  // Quem joga numa aba e volta para a home em outra ve o selo atualizado.
  window.addEventListener('storage', pintarJogos);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) pintarJogos();
  });
}
