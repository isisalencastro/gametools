import { copyToClipboard, fetchWithTimeout } from '../common/utils.js';
import { fireConfetti } from '../tools/confetti.js';

const FALLBACK_QUESTIONS = [
  { q: 'Qual planeta é conhecido como planeta vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Mercúrio'], a: 1 },
  { q: 'Quanto é 9 x 7?', options: ['56', '63', '72', '49'], a: 1 },
  { q: 'Qual linguagem é usada para estilizar páginas web?', options: ['HTML', 'CSS', 'SQL', 'Python'], a: 1 },
  { q: 'Qual é o maior oceano da Terra?', options: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'], a: 2 },
  { q: 'Qual destes é um mamífero?', options: ['Tubarão', 'Golfinho', 'Polvo', 'Sardinha'], a: 1 },
  { q: 'Quantos segundos há em 2 minutos?', options: ['120', '60', '90', '180'], a: 0 },
  { q: 'Em que continente fica o Brasil?', options: ['Europa', 'Ásia', 'América do Sul', 'África'], a: 2 },
  { q: 'Qual tecla geralmente envia formulários?', options: ['Esc', 'Shift', 'Enter', 'Tab'], a: 2 },
  { q: 'Qual cor surge da mistura de azul com amarelo?', options: ['Roxo', 'Verde', 'Laranja', 'Rosa'], a: 1 },
  { q: 'Qual animal é famoso por sua lentidão?', options: ['Leão', 'Preguiça', 'Águia', 'Cavalo'], a: 1 },
];

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchTriviaQuestions(amount = 10) {
  try {
    const resp = await fetchWithTimeout(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
      6000,
    );
    const data = await resp.json();
    if (data.response_code !== 0 || !data.results?.length) return null;

    return data.results.map((item) => {
      const correct = decodeHTML(item.correct_answer);
      const allOptions = shuffle([
        correct,
        ...item.incorrect_answers.map(decodeHTML),
      ]);
      return {
        q: decodeHTML(item.question),
        options: allOptions,
        a: allOptions.indexOf(correct),
        category: decodeHTML(item.category),
        difficulty: item.difficulty,
      };
    });
  } catch {
    return null;
  }
}

export function initQuickQuizFeature() {
  const quizStatus = document.getElementById('quiz-status');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizReset = document.getElementById('quiz-reset');
  const quizShare = document.getElementById('quiz-share');
  const quizTimerBar = document.getElementById('quiz-timer-fill');
  const quizSource = document.getElementById('quiz-source');
  const quizCategory = document.getElementById('quiz-category');

  if (!quizStatus || !quizQuestion || !quizOptions || !quizFeedback || !quizReset || !quizShare) return;

  const quizStorageKey = 'gametools_quiz_best';
  const quizTimePerQuestion = 15;

  let questions = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizTimeLeft = quizTimePerQuestion;
  let quizTimer = null;
  let quizEnded = false;
  let usingAPI = false;
  let quizLocked = false;

  function quizBest() {
    return Number(localStorage.getItem(quizStorageKey) || '0');
  }

  function quizUpdateStatus() {
    const total = questions.length || 10;
    quizStatus.textContent = `Pergunta ${Math.min(quizIndex + 1, total)}/${total} · Tempo: ${quizTimeLeft}s · Pontos: ${quizScore} · Melhor: ${quizBest()}`;
  }

  function updateTimerBar() {
    if (!quizTimerBar) return;
    const pct = (quizTimeLeft / quizTimePerQuestion) * 100;
    quizTimerBar.style.width = `${pct}%`;
  }

  function quizNext() {
    quizIndex += 1;
    quizFeedback.textContent = '';
    quizLocked = false;

    if (quizIndex >= questions.length) {
      quizFinish();
      return;
    }

    quizRenderQuestion();
  }

  function quizFinish() {
    clearInterval(quizTimer);
    quizEnded = true;
    const total = questions.length;
    const isNewBest = quizScore > quizBest();
    if (isNewBest) {
      localStorage.setItem(quizStorageKey, String(quizScore));
    }
    quizQuestion.textContent = 'Fim do quiz!';
    quizOptions.innerHTML = '';
    quizFeedback.textContent = `Pontuação final: ${quizScore} de ${total}.${isNewBest ? ' Novo recorde!' : ''}`;
    quizStatus.textContent = `Quiz finalizado · Melhor pontuação: ${quizBest()}`;
    if (quizCategory) quizCategory.textContent = '';
    if (quizTimerBar) quizTimerBar.style.width = '0%';

    if (quizScore >= total * 0.7) {
      fireConfetti();
    }
  }

  function quizHandleAnswer(answerIndex, buttons) {
    if (quizEnded || quizLocked) return;
    quizLocked = true;
    clearInterval(quizTimer);

    const current = questions[quizIndex];
    const correctIdx = current.a;

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
      if (idx === answerIndex && answerIndex !== correctIdx) btn.classList.add('wrong');
    });

    if (answerIndex === correctIdx) {
      quizScore += 1;
      quizFeedback.textContent = 'Resposta correta!';
    } else {
      quizFeedback.textContent = `Incorreta. Correta: ${current.options[correctIdx]}.`;
    }

    quizUpdateStatus();
    setTimeout(quizNext, 1000);
  }

  function quizTick() {
    quizTimeLeft -= 1;
    quizUpdateStatus();
    updateTimerBar();
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimer);
      quizLocked = true;
      quizFeedback.textContent = `Tempo esgotado! Correta: ${questions[quizIndex].options[questions[quizIndex].a]}.`;
      const btns = quizOptions.querySelectorAll('.btn');
      btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === questions[quizIndex].a) btn.classList.add('correct');
      });
      setTimeout(quizNext, 1200);
    }
  }

  function quizRenderQuestion() {
    const current = questions[quizIndex];
    quizEnded = false;
    quizTimeLeft = quizTimePerQuestion;
    quizQuestion.textContent = current.q;
    quizOptions.innerHTML = '';

    if (quizCategory && current.category) {
      quizCategory.textContent = `Categoria: ${current.category}`;
    }

    const buttons = [];
    current.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      button.textContent = option;
      button.addEventListener('click', () => quizHandleAnswer(index, buttons));
      quizOptions.appendChild(button);
      buttons.push(button);
    });

    quizUpdateStatus();
    updateTimerBar();
    clearInterval(quizTimer);
    quizTimer = setInterval(quizTick, 1000);
  }

  async function quizShareResult() {
    const total = questions.length;
    const text = `No Quiz Rápido fiz ${quizScore}/${total} no GameTools!${usingAPI ? ' (perguntas ao vivo via Open Trivia DB)' : ''}`;
    if (navigator.share) {
      await navigator.share({ title: 'Quiz Rápido - GameTools', text });
      return;
    }
    copyToClipboard(text, quizShare);
  }

  async function quizResetGame() {
    clearInterval(quizTimer);
    quizIndex = 0;
    quizScore = 0;
    quizEnded = false;
    quizLocked = false;
    quizFeedback.textContent = '';
    quizQuestion.textContent = 'Carregando perguntas...';
    quizOptions.innerHTML = '';

    const apiQuestions = await fetchTriviaQuestions(10);
    if (apiQuestions) {
      questions = apiQuestions;
      usingAPI = true;
      if (quizSource) quizSource.textContent = 'Perguntas: Open Trivia DB (ao vivo)';
    } else {
      questions = shuffle(FALLBACK_QUESTIONS).slice(0, 10);
      usingAPI = false;
      if (quizSource) quizSource.textContent = 'Perguntas: banco local (offline)';
    }

    quizRenderQuestion();
  }

  quizReset.addEventListener('click', quizResetGame);
  quizShare.addEventListener('click', () => {
    quizShareResult().catch(() => {
      quizFeedback.textContent = 'Falha ao compartilhar resultado.';
    });
  });

  quizResetGame();
}
