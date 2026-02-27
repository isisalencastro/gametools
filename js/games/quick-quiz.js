import { copyToClipboard } from '../common/utils.js';
import { fireConfetti } from '../tools/confetti.js';

const QUESTIONS = [
  { q: 'Qual planeta é conhecido como planeta vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Mercúrio'], a: 1, category: 'Ciência' },
  { q: 'Quanto é 9 x 7?', options: ['56', '63', '72', '49'], a: 1, category: 'Matemática' },
  { q: 'Qual linguagem é usada para estilizar páginas web?', options: ['HTML', 'CSS', 'SQL', 'Python'], a: 1, category: 'Tecnologia' },
  { q: 'Qual é o maior oceano da Terra?', options: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'], a: 2, category: 'Geografia' },
  { q: 'Qual destes é um mamífero?', options: ['Tubarão', 'Golfinho', 'Polvo', 'Sardinha'], a: 1, category: 'Ciência' },
  { q: 'Quantos segundos há em 2 minutos?', options: ['120', '60', '90', '180'], a: 0, category: 'Matemática' },
  { q: 'Em que continente fica o Brasil?', options: ['Europa', 'Ásia', 'América do Sul', 'África'], a: 2, category: 'Geografia' },
  { q: 'Qual tecla geralmente envia formulários?', options: ['Esc', 'Shift', 'Enter', 'Tab'], a: 2, category: 'Tecnologia' },
  { q: 'Qual cor surge da mistura de azul com amarelo?', options: ['Roxo', 'Verde', 'Laranja', 'Rosa'], a: 1, category: 'Ciência' },
  { q: 'Qual animal é famoso por sua lentidão?', options: ['Leão', 'Preguiça', 'Águia', 'Cavalo'], a: 1, category: 'Ciência' },
  { q: 'Qual é a capital do Brasil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], a: 2, category: 'Geografia' },
  { q: 'Quantos lados tem um hexágono?', options: ['5', '6', '7', '8'], a: 1, category: 'Matemática' },
  { q: 'Qual é o maior planeta do Sistema Solar?', options: ['Saturno', 'Netuno', 'Júpiter', 'Urano'], a: 2, category: 'Ciência' },
  { q: 'Quem pintou a Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'], a: 1, category: 'Arte e Cultura' },
  { q: 'Qual é o elemento químico representado pela letra O?', options: ['Ouro', 'Ósmio', 'Oxigênio', 'Ônio'], a: 2, category: 'Ciência' },
  { q: 'Qual o resultado de 144 ÷ 12?', options: ['10', '11', '12', '14'], a: 2, category: 'Matemática' },
  { q: 'Qual é o rio mais longo do mundo?', options: ['Rio Amazonas', 'Rio Nilo', 'Rio Mississipi', 'Rio Yangtzé'], a: 1, category: 'Geografia' },
  { q: 'Em que ano o Brasil foi descoberto?', options: ['1492', '1500', '1510', '1498'], a: 1, category: 'História' },
  { q: 'Qual gás as plantas absorvem da atmosfera?', options: ['Oxigênio', 'Nitrogênio', 'Gás carbônico', 'Hélio'], a: 2, category: 'Ciência' },
  { q: 'Qual instrumento tem 88 teclas?', options: ['Violão', 'Piano', 'Acordeão', 'Órgão'], a: 1, category: 'Arte e Cultura' },
  { q: 'Qual é o menor estado brasileiro em área?', options: ['Alagoas', 'Sergipe', 'Rio de Janeiro', 'Espírito Santo'], a: 1, category: 'Geografia' },
  { q: 'Quantos ossos tem o corpo humano adulto?', options: ['196', '206', '216', '186'], a: 1, category: 'Ciência' },
  { q: 'Qual é a fórmula da água?', options: ['CO2', 'NaCl', 'H2O', 'O2'], a: 2, category: 'Ciência' },
  { q: 'Quem escreveu "Dom Casmurro"?', options: ['José de Alencar', 'Machado de Assis', 'Clarice Lispector', 'Jorge Amado'], a: 1, category: 'Arte e Cultura' },
  { q: 'Qual é a moeda oficial do Japão?', options: ['Yuan', 'Won', 'Iene', 'Rupia'], a: 2, category: 'Geografia' },
  { q: 'Quantas horas tem um dia?', options: ['20', '22', '24', '26'], a: 2, category: 'Ciência' },
  { q: 'Qual o nome do satélite natural da Terra?', options: ['Sol', 'Lua', 'Marte', 'Vênus'], a: 1, category: 'Ciência' },
  { q: 'Qual é a raiz quadrada de 81?', options: ['7', '8', '9', '10'], a: 2, category: 'Matemática' },
  { q: 'Qual país tem formato de bota no mapa?', options: ['Grécia', 'Itália', 'Portugal', 'Espanha'], a: 1, category: 'Geografia' },
  { q: 'Qual a linguagem de programação criada por Brendan Eich?', options: ['Python', 'Java', 'JavaScript', 'C++'], a: 2, category: 'Tecnologia' },
  { q: 'Qual o nome do processo de transformação de lagarta em borboleta?', options: ['Mutação', 'Metamorfose', 'Mimetismo', 'Simbiose'], a: 1, category: 'Ciência' },
  { q: 'Quantos estados tem o Brasil?', options: ['24', '25', '26', '27'], a: 2, category: 'Geografia' },
  { q: 'Qual vitamina é obtida pela exposição ao sol?', options: ['Vitamina A', 'Vitamina B', 'Vitamina C', 'Vitamina D'], a: 3, category: 'Ciência' },
  { q: 'Qual esporte é conhecido como "o esporte bretão"?', options: ['Vôlei', 'Futebol', 'Basquete', 'Tênis'], a: 1, category: 'Esportes' },
  { q: 'Qual é o metal mais leve?', options: ['Alumínio', 'Lítio', 'Ferro', 'Magnésio'], a: 1, category: 'Ciência' },
  { q: 'Qual a capital da Argentina?', options: ['Montevidéu', 'Santiago', 'Buenos Aires', 'Lima'], a: 2, category: 'Geografia' },
  { q: 'Quanto é 15% de 200?', options: ['15', '20', '25', '30'], a: 3, category: 'Matemática' },
  { q: 'Qual seleção venceu a primeira Copa do Mundo de futebol em 1930?', options: ['Brasil', 'Argentina', 'Uruguai', 'Itália'], a: 2, category: 'Esportes' },
  { q: 'Qual é o animal terrestre mais rápido do mundo?', options: ['Leão', 'Cavalo', 'Guepardo', 'Antílope'], a: 2, category: 'Ciência' },
  { q: 'Qual é o símbolo químico do ouro?', options: ['Or', 'Au', 'Ag', 'Go'], a: 1, category: 'Ciência' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initQuickQuizFeature() {
  const quizStatus = document.getElementById('quiz-status');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizReset = document.getElementById('quiz-reset');
  const quizShare = document.getElementById('quiz-share');
  const quizTimerBar = document.getElementById('quiz-timer-fill');
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
    const text = `No Quiz Rápido fiz ${quizScore}/${total} no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Quiz Rápido - GameTools', text });
      return;
    }
    copyToClipboard(text, quizShare);
  }

  function quizResetGame() {
    clearInterval(quizTimer);
    quizIndex = 0;
    quizScore = 0;
    quizEnded = false;
    quizLocked = false;
    quizFeedback.textContent = '';
    quizOptions.innerHTML = '';
    questions = shuffle(QUESTIONS).slice(0, 10);
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
