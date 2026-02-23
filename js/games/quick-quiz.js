export function initQuickQuizFeature() {
  const quizStatus = document.getElementById('quiz-status');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizReset = document.getElementById('quiz-reset');
  const quizShare = document.getElementById('quiz-share');

  if (!quizStatus || !quizQuestion || !quizOptions || !quizFeedback || !quizReset || !quizShare) return;

  const quizStorageKey = 'gametools_quiz_best';
  const quizTimePerQuestion = 12;
  const quizQuestions = [
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

  let quizIndex = 0;
  let quizScore = 0;
  let quizTimeLeft = quizTimePerQuestion;
  let quizTimer = null;
  let quizEnded = false;

  function quizBest() {
    return Number(localStorage.getItem(quizStorageKey) || '0');
  }

  function quizUpdateStatus() {
    quizStatus.textContent = `Pergunta ${quizIndex + 1}/${quizQuestions.length} · Tempo: ${quizTimeLeft}s · Pontos: ${quizScore} · Melhor: ${quizBest()}`;
  }

  function quizNext() {
    quizIndex += 1;
    quizFeedback.textContent = '';

    if (quizIndex >= quizQuestions.length) {
      quizFinish();
      return;
    }

    quizRenderQuestion();
  }

  function quizFinish() {
    clearInterval(quizTimer);
    quizEnded = true;
    if (quizScore > quizBest()) {
      localStorage.setItem(quizStorageKey, String(quizScore));
    }
    quizQuestion.textContent = 'Fim do quiz!';
    quizOptions.innerHTML = '';
    quizFeedback.textContent = `Pontuação final: ${quizScore} de ${quizQuestions.length}.`;
    quizStatus.textContent = `Quiz finalizado · Melhor pontuação: ${quizBest()}`;
  }

  function quizHandleAnswer(answerIndex) {
    if (quizEnded) return;
    const current = quizQuestions[quizIndex];
    if (answerIndex === current.a) {
      quizScore += 1;
      quizFeedback.textContent = 'Resposta correta!';
    } else {
      quizFeedback.textContent = `Resposta incorreta. Correta: ${current.options[current.a]}.`;
    }
    clearInterval(quizTimer);
    setTimeout(quizNext, 450);
  }

  function quizTick() {
    quizTimeLeft -= 1;
    quizUpdateStatus();
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimer);
      quizFeedback.textContent = 'Tempo esgotado!';
      setTimeout(quizNext, 450);
    }
  }

  function quizRenderQuestion() {
    const current = quizQuestions[quizIndex];
    quizEnded = false;
    quizTimeLeft = quizTimePerQuestion;
    quizQuestion.textContent = current.q;
    quizOptions.innerHTML = '';

    current.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      button.textContent = option;
      button.addEventListener('click', () => quizHandleAnswer(index));
      quizOptions.appendChild(button);
    });

    quizUpdateStatus();
    clearInterval(quizTimer);
    quizTimer = setInterval(quizTick, 1000);
  }

  async function quizShareResult() {
    const text = `No Quiz Rápido fiz ${quizScore}/${quizQuestions.length} no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Quiz Rápido - GameTools', text });
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      quizFeedback.textContent = 'Resultado copiado para compartilhar.';
      return;
    }

    quizFeedback.textContent = 'Não foi possível compartilhar automaticamente.';
  }

  function quizResetGame() {
    clearInterval(quizTimer);
    quizIndex = 0;
    quizScore = 0;
    quizFeedback.textContent = '';
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
