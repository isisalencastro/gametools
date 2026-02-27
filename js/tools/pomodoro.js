import { copyToClipboard, setLiveRegion } from '../common/utils.js';

const STORAGE_KEY = 'pomodoro_sessions';
const STORAGE_SETTINGS_KEY = 'pomodoro_settings';

function loadSessions() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveSessions(count) {
  try {
    localStorage.setItem(STORAGE_KEY, String(count));
  } catch { /* noop */ }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSettings(foco, pausa) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify({ foco, pausa }));
  } catch { /* noop */ }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
    setTimeout(() => ctx.close(), 1200);
  } catch { /* Web Audio not available */ }
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function sendNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '../assets/svgs/ibagametools_icon_right.svg' });
  } catch { /* noop */ }
}

export function initPomodoroFeature() {
  const focoInput = document.getElementById('foco');
  const pausaInput = document.getElementById('pausa');
  const iniciar = document.getElementById('iniciar');
  const pausar = document.getElementById('pausar');
  const resetar = document.getElementById('resetar');
  const copiar = document.getElementById('copiar');
  const timerEl = document.getElementById('timer');
  const resultado = document.getElementById('resultado');
  const sessionsEl = document.getElementById('pomodoro-sessions');
  const notifBtn = document.getElementById('pomodoro-notif');

  if (!focoInput || !pausaInput || !iniciar || !pausar || !resetar || !copiar || !timerEl || !resultado) return;

  setLiveRegion(resultado);
  setLiveRegion(timerEl);

  let segundosRestantes = 25 * 60;
  let emFoco = true;
  let intervalo = null;
  let sessionsCount = loadSessions();

  const savedSettings = loadSettings();
  if (savedSettings) {
    focoInput.value = savedSettings.foco;
    pausaInput.value = savedSettings.pausa;
  }

  function renderSessions() {
    if (sessionsEl) {
      sessionsEl.textContent = `Sessões de foco concluídas: ${sessionsCount}`;
    }
  }

  renderSessions();

  function dois(n) {
    return String(n).padStart(2, '0');
  }

  function desenhar() {
    const m = Math.floor(segundosRestantes / 60);
    const s = segundosRestantes % 60;
    timerEl.textContent = `${dois(m)}:${dois(s)}`;
    document.title = `${dois(m)}:${dois(s)} · Pomodoro | IBAGameTools`;
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

    saveSettings(foco, pausa);
    emFoco = estadoFoco;
    segundosRestantes = (emFoco ? foco : pausa) * 60;
    resultado.textContent = `Modo atual: ${emFoco ? 'foco' : 'pausa'}. Duração: ${emFoco ? foco : pausa} min.`;
    desenhar();
    return true;
  }

  function onCycleEnd() {
    playBeep();

    if (emFoco) {
      sessionsCount += 1;
      saveSessions(sessionsCount);
      renderSessions();
      sendNotification('Pomodoro concluído!', `Sessão de foco #${sessionsCount} finalizada. Hora de uma pausa!`);
    } else {
      sendNotification('Pausa encerrada!', 'Hora de voltar ao foco!');
    }

    emFoco = !emFoco;
    aplicarInicio(emFoco);
    resultado.textContent += ' Ciclo concluído!';
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
        onCycleEnd();
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
    document.title = 'Cronômetro Pomodoro online | IBAGameTools';
  });

  copiar.addEventListener('click', () => {
    const text = `${timerEl.textContent} – ${resultado.textContent} | Sessões: ${sessionsCount}`;
    copyToClipboard(text, copiar);
  });

  if (notifBtn) {
    notifBtn.addEventListener('click', async () => {
      const granted = await requestNotificationPermission();
      resultado.textContent = granted
        ? 'Notificações ativadas! Você será avisado ao fim de cada ciclo.'
        : 'Notificações não permitidas pelo navegador.';
    });
  }

  desenhar();
}
