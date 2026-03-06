import { copyToClipboard } from '../common/utils.js';
import { fireConfetti } from '../tools/confetti.js';

const CHALLENGES = [
  {
    code: `function soma(a, b) {\n  return a - b;\n}`,
    question: 'Qual é o erro nesta função que deveria somar dois números?',
    options: [
      'Faltam chaves na função',
      'O operador deveria ser + em vez de -',
      'Os parâmetros estão invertidos',
      'Falta ponto e vírgula no return',
    ],
    answer: 1,
    explanation: 'A função se chama "soma", mas usa o operador de subtração (-).',
    difficulty: 'facil',
  },
  {
    code: `for (let i = 0; i <= 10; i--) {\n  console.log(i);\n}`,
    question: 'O que causa um loop infinito neste código?',
    options: [
      'A condição deveria ser i < 10',
      'Falta declarar i com var',
      'O incremento deveria ser i++ em vez de i--',
      'console.log não funciona dentro de for',
    ],
    answer: 2,
    explanation: 'i começa em 0 e só decrementa (i--), nunca ultrapassando 10.',
    difficulty: 'facil',
  },
  {
    code: `let idade = 18;\nif (idade = 21) {\n  console.log("Pode entrar");\n}`,
    question: 'Por que essa condição sempre é verdadeira?',
    options: [
      'Deveria usar === em vez de = (atribuição vs comparação)',
      'A variável deveria ser const',
      'Faltam parênteses no console.log',
      'O valor 21 deveria ser string',
    ],
    answer: 0,
    explanation: 'O operador = atribui o valor 21 a "idade" (truthy), em vez de comparar.',
    difficulty: 'facil',
  },
  {
    code: `const frutas = ["maçã", "banana"];\nconsole.log(frutas.length());`,
    question: 'Por que este código gera um erro?',
    options: [
      'O array deveria usar parênteses em vez de colchetes',
      'length é uma propriedade, não um método — remova os ()',
      'Deveria ser frutas.size()',
      'console.log não aceita arrays',
    ],
    answer: 1,
    explanation: 'length é uma propriedade de arrays, não uma função. O correto é frutas.length sem ().',
    difficulty: 'facil',
  },
  {
    code: `function ehPar(n) {\n  return n % 2 === 1;\n}`,
    question: 'A função deveria retornar true se o número for par. Qual é o bug?',
    options: [
      'O operador % não funciona com números',
      'Deveria comparar com === 0 em vez de === 1',
      'Falta a palavra-chave function',
      'O parâmetro deveria se chamar "numero"',
    ],
    answer: 1,
    explanation: 'Um número par tem resto 0 na divisão por 2, não 1.',
    difficulty: 'facil',
  },
  {
    code: `function fatorial(n) {\n  if (n === 0) return 0;\n  return n * fatorial(n - 1);\n}`,
    question: 'Por que fatorial(5) retorna 0 em vez de 120?',
    options: [
      'A recursão deveria usar n + 1',
      'O caso base deveria retornar 1 em vez de 0',
      'Falta o else na condição',
      'Deveria usar while em vez de recursão',
    ],
    answer: 1,
    explanation: 'O fatorial de 0 é 1, não 0. Retornar 0 faz toda a multiplicação resultar em 0.',
    difficulty: 'medio',
  },
  {
    code: `function maximo(a, b) {\n  return a < b ? a : b;\n}`,
    question: 'A função deveria retornar o maior valor. Qual é o bug?',
    options: [
      'Deveria usar > em vez de < no ternário',
      'Os parâmetros estão na ordem errada',
      'O ternário está com a lógica invertida — retorna o menor',
      'Falta converter para número',
    ],
    answer: 2,
    explanation: 'Quando a < b, retorna a (o menor). O correto seria retornar b, ou inverter a condição.',
    difficulty: 'medio',
  },
  {
    code: `const pi = 3.41;`,
    question: 'Qual é o erro nesta constante?',
    options: [
      'Deveria usar let em vez de const',
      'O valor de π é aproximadamente 3.14, não 3.41',
      'Deveria ser escrito como Math.PI',
      'Falta ponto e vírgula',
    ],
    answer: 1,
    explanation: 'Os dígitos estão trocados. O valor correto de π é ≈ 3.14159.',
    difficulty: 'facil',
  },
  {
    code: `function inverter(str) {\n  return str.split("").reversed().join("");\n}`,
    question: 'Por que esta função gera erro ao tentar inverter uma string?',
    options: [
      'split não aceita string vazia',
      'O método correto é .reverse(), não .reversed()',
      'join deveria receber um espaço",',
      'Strings não podem ser invertidas',
    ],
    answer: 1,
    explanation: 'O método de arrays é .reverse(), não .reversed().',
    difficulty: 'medio',
  },
  {
    code: `let total = "5" + 3;\nconsole.log(total);`,
    question: 'O resultado esperado era 8, mas aparece "53". Por quê?',
    options: [
      'Deveria usar let em vez de const',
      '"5" é string; o + concatena em vez de somar',
      'console.log converte para string automaticamente',
      'O JavaScript não suporta somar números',
    ],
    answer: 1,
    explanation: 'Quando um dos operandos do + é string, o JS concatena. Use Number("5") + 3.',
    difficulty: 'facil',
  },
  {
    code: `function buscar(arr, alvo) {\n  for (let i = 0; i <= arr.length; i++) {\n    if (arr[i] === alvo) return i;\n  }\n  return -1;\n}`,
    question: 'Essa função de busca pode causar um erro. Qual?',
    options: [
      'Deveria usar < em vez de <= (acessa índice fora do array)',
      'O return -1 está no lugar errado',
      'Deveria usar forEach em vez de for',
      'A comparação deveria ser == em vez de ===',
    ],
    answer: 0,
    explanation: 'Com <=, o loop acessa arr[arr.length], que é undefined e fora dos limites.',
    difficulty: 'medio',
  },
  {
    code: `async function dados() {\n  const res = fetch("/api/dados");\n  const json = res.json();\n  return json;\n}`,
    question: 'Por que esta função assíncrona não funciona corretamente?',
    options: [
      'fetch deveria ser chamado com https',
      'Faltam os await antes de fetch() e res.json()',
      'A função deveria retornar uma Promise',
      'json() não existe em respostas HTTP',
    ],
    answer: 1,
    explanation: 'fetch() retorna uma Promise. Sem await, res será a Promise, não a resposta.',
    difficulty: 'dificil',
  },
  {
    code: `const numeros = [1, 2, 3, 4, 5];\nconst dobro = numeros.map((n) => { n * 2 });`,
    question: 'Por que o array "dobro" contém apenas valores undefined?',
    options: [
      'map não funciona com arrow functions',
      'Falta o return dentro das chaves (ou remover as chaves)',
      'Deveria usar forEach em vez de map',
      'O operador * não funciona em map',
    ],
    answer: 1,
    explanation: 'Com chaves {}, a arrow function precisa de return explícito. Sem chaves: (n) => n * 2.',
    difficulty: 'medio',
  },
  {
    code: `class Animal {\n  constructor(nome) {\n    nome = nome;\n  }\n}`,
    question: 'Por que new Animal("Rex").nome é undefined?',
    options: [
      'Deveria usar this.nome = nome',
      'Classes não suportam constructor',
      'O parâmetro deveria se chamar "name"',
      'Falta a palavra new antes de Animal',
    ],
    answer: 0,
    explanation: 'Sem this, a atribuição é feita ao próprio parâmetro, não à instância.',
    difficulty: 'medio',
  },
  {
    code: `setTimeout(() => {\n  console.log("Primeiro");\n}, 0);\nconsole.log("Segundo");`,
    question: 'Qual texto aparece primeiro no console?',
    options: [
      '"Primeiro", porque o timeout é 0ms',
      '"Segundo", porque setTimeout é assíncrono',
      'Os dois aparecem ao mesmo tempo',
      'Nenhum — o código dá erro',
    ],
    answer: 1,
    explanation: 'Mesmo com 0ms, setTimeout vai para a fila de tarefas. O código síncrono roda antes.',
    difficulty: 'dificil',
  },
  {
    code: `function celsius(f) {\n  return f - 32 * 5 / 9;\n}`,
    question: 'A conversão Fahrenheit→Celsius está errada. Por quê?',
    options: [
      'A fórmula deveria ser (f - 32) * 5 / 9 — faltam parênteses',
      'Deveria dividir por 5, não por 9',
      'Deveria somar 32 em vez de subtrair',
      'O resultado deveria ser arredondado',
    ],
    answer: 0,
    explanation: 'Sem parênteses, a multiplicação e divisão são feitas antes da subtração.',
    difficulty: 'medio',
  },
  {
    code: `const pessoa = { nome: "Ana" };\nObject.freeze(pessoa);\npessoa.nome = "Carlos";\nconsole.log(pessoa.nome);`,
    question: 'O que é exibido no console?',
    options: [
      '"Carlos" — a atribuição funciona normalmente',
      '"Ana" — Object.freeze impede alterações',
      'undefined — freeze apaga as propriedades',
      'Erro — não se pode reatribuir objetos frozen',
    ],
    answer: 1,
    explanation: 'Object.freeze torna o objeto imutável. A atribuição é silenciosamente ignorada.',
    difficulty: 'dificil',
  },
  {
    code: `function contagem() {\n  for (var i = 0; i < 3; i++) {\n    setTimeout(() => console.log(i), 100);\n  }\n}`,
    question: 'O esperado era 0, 1, 2. O que aparece?',
    options: [
      '0, 1, 2 — funciona corretamente',
      '3, 3, 3 — var não cria escopo de bloco',
      'undefined, undefined, undefined',
      'Erro de referência — i não existe',
    ],
    answer: 1,
    explanation: 'var é hoisted para o escopo da função. Quando os timeouts rodam, i já é 3. Use let.',
    difficulty: 'dificil',
  },
  {
    code: `const lista = [3, 1, 4, 1, 5];\nlista.sort();\nconsole.log(lista);`,
    question: 'O resultado é [1, 1, 3, 4, 5]. Mas com [10, 9, 80] o sort dá errado. Por quê?',
    options: [
      'sort() não funciona com números',
      'sort() ordena como strings por padrão — use sort((a,b) => a-b)',
      'O array precisa ser copiado antes de ordenar',
      'Deveria usar lista.order() para números',
    ],
    answer: 1,
    explanation: 'Sem comparador, sort() converte para strings. "80" vem antes de "9" lexicograficamente.',
    difficulty: 'medio',
  },
  {
    code: `function saudacao(nome) {\n  return\n    "Olá, " + nome + "!";\n}`,
    question: 'Por que saudacao("Ana") retorna undefined?',
    options: [
      'A concatenação de strings está errada',
      'O JS insere ; após return (ASI). O valor fica inalcançável',
      'Faltam parênteses no return',
      'A função deveria usar template literals',
    ],
    answer: 1,
    explanation: 'O Automatic Semicolon Insertion (ASI) adiciona ; após return, ignorando a linha seguinte.',
    difficulty: 'dificil',
  },
  {
    code: `const x = 0.1 + 0.2;\nconsole.log(x === 0.3);`,
    question: 'Por que o resultado é false?',
    options: [
      'Deveria usar == em vez de ===',
      'Ponto flutuante tem imprecisão: 0.1+0.2 ≈ 0.30000000000000004',
      'const não permite operações matemáticas',
      'O console.log converte o resultado',
    ],
    answer: 1,
    explanation: 'Números de ponto flutuante (IEEE 754) têm imprecisão. Use Math.abs(x - 0.3) < 0.0001.',
    difficulty: 'dificil',
  },
  {
    code: `const btn = document.getElementById("meuBtn");\nbtn.addEventListener("click", alerta());\n\nfunction alerta() {\n  alert("Clicou!");\n}`,
    question: 'O alerta aparece imediatamente, sem clicar. Por quê?',
    options: [
      'getElementById não funciona com IDs',
      'alerta() é chamada imediatamente — passe alerta sem ()',
      'addEventListener não aceita funções nomeadas',
      'Deveria usar onclick em vez de addEventListener',
    ],
    answer: 1,
    explanation: 'Os () executam a função na hora. Passe a referência: addEventListener("click", alerta).',
    difficulty: 'medio',
  },
  {
    code: `function dobrar(arr) {\n  arr.forEach((item) => {\n    return item * 2;\n  });\n}`,
    question: 'Por que dobrar([1,2,3]) não retorna [2,4,6]?',
    options: [
      'forEach não retorna um novo array — use map',
      'O return está no lugar errado',
      'Deveria usar for...of em vez de forEach',
      'item * 2 não funciona dentro de callbacks',
    ],
    answer: 0,
    explanation: 'forEach sempre retorna undefined. Para transformar, use .map().',
    difficulty: 'medio',
  },
  {
    code: `const obj = { a: 1, b: 2, c: 3 };\nconst keys = Object.key(obj);`,
    question: 'Por que este código gera um TypeError?',
    options: [
      'Objetos não têm chaves em JavaScript',
      'O método correto é Object.keys() (com "s")',
      'Deveria usar obj.keys()',
      'const não pode armazenar arrays',
    ],
    answer: 1,
    explanation: 'O método é Object.keys() no plural. Object.key não existe.',
    difficulty: 'facil',
  },
  {
    code: `let msg = "Olá";\nmsg[0] = "E";\nconsole.log(msg);`,
    question: 'O esperado era "Elá", mas continua "Olá". Por quê?',
    options: [
      'Strings são imutáveis em JavaScript',
      'Deveria usar msg.charAt(0)',
      'Strings não suportam índices',
      'let não permite modificar strings',
    ],
    answer: 0,
    explanation: 'Strings são primitivos imutáveis. Para alterar, crie uma nova: "E" + msg.slice(1).',
    difficulty: 'medio',
  },
  {
    code: `function soma(...nums) {\n  let total = 0;\n  for (const n in nums) {\n    total += n;\n  }\n  return total;\n}`,
    question: 'soma(1,2,3) retorna "0012" em vez de 6. Qual é o bug?',
    options: [
      'rest parameters não funcionam com for',
      'for...in itera sobre índices (strings), não valores — use for...of',
      'Deveria usar reduce em vez de for',
      'const não pode ser usado em loops',
    ],
    answer: 1,
    explanation: 'for...in itera sobre chaves (strings "0","1","2"). Concatena em vez de somar.',
    difficulty: 'dificil',
  },
];

const DIFFICULTY_LABELS = {
  facil: { text: 'Fácil', color: 'var(--mint)' },
  medio: { text: 'Médio', color: 'var(--yellow)' },
  dificil: { text: 'Difícil', color: 'var(--peach)' },
};

const DIFFICULTY_FILTERS = [
  { id: 'todas', name: 'Todas as Dificuldades', icon: '🎲' },
  { id: 'facil', name: 'Fácil', icon: '🟢' },
  { id: 'medio', name: 'Médio', icon: '🟡' },
  { id: 'dificil', name: 'Difícil', icon: '🔴' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initDebugChallengeFeature() {
  const gameArea = document.getElementById('debug-game-area');
  const statusEl = document.getElementById('debug-status');
  const codeEl = document.getElementById('debug-code');
  const questionEl = document.getElementById('debug-question');
  const optionsEl = document.getElementById('debug-options');
  const feedbackEl = document.getElementById('debug-feedback');
  const explanationEl = document.getElementById('debug-explanation');
  const resetBtn = document.getElementById('debug-reset');
  const shareBtn = document.getElementById('debug-share');
  const difficultySelect = document.getElementById('debug-difficulty-select');
  const difficultyTag = document.getElementById('debug-difficulty-tag');
  const timerFill = document.getElementById('debug-timer-fill');
  const progressText = document.getElementById('debug-progress');

  if (!gameArea || !statusEl || !codeEl || !questionEl || !optionsEl || !feedbackEl || !resetBtn || !shareBtn) return;

  const STORAGE_KEY = 'gametools_debug_best';
  const ROUNDS = 8;
  const TIME_PER_ROUND = 30;

  let challenges = [];
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let timeLeft = TIME_PER_ROUND;
  let timer = null;
  let ended = false;
  let locked = false;
  let selectedDifficulty = 'todas';

  function bestScore() {
    return Number(localStorage.getItem(STORAGE_KEY) || '0');
  }

  function saveBest(val) {
    localStorage.setItem(STORAGE_KEY, String(val));
  }

  function buildDifficultyGrid() {
    if (!difficultySelect) return;
    difficultySelect.innerHTML = '';

    DIFFICULTY_FILTERS.forEach(d => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-cat-card';
      const colorMap = { todas: 'var(--accent)', facil: 'var(--mint)', medio: 'var(--yellow)', dificil: 'var(--peach)' };
      btn.style.setProperty('--cat-color', colorMap[d.id]);

      const count = d.id === 'todas'
        ? CHALLENGES.length
        : CHALLENGES.filter(c => c.difficulty === d.id).length;

      btn.innerHTML = `<span class="quiz-cat-icon">${d.icon}</span><span class="quiz-cat-name">${d.name}</span><span class="quiz-cat-count">${count} desafios</span>`;
      btn.addEventListener('click', () => startWithDifficulty(d.id));
      difficultySelect.appendChild(btn);
    });
  }

  function startWithDifficulty(diff) {
    selectedDifficulty = diff;
    if (difficultySelect) difficultySelect.style.display = 'none';
    if (gameArea) gameArea.style.display = 'block';
    resetGame();
  }

  function showDifficultySelect() {
    if (difficultySelect) difficultySelect.style.display = '';
    if (gameArea) gameArea.style.display = 'none';
  }

  function updateStatus() {
    const total = challenges.length;
    statusEl.textContent = `Desafio ${Math.min(currentIndex + 1, total)}/${total} · Tempo: ${timeLeft}s · Acertos: ${score} · Melhor: ${bestScore()}`;
  }

  function updateTimerBar() {
    if (!timerFill) return;
    const pct = (timeLeft / TIME_PER_ROUND) * 100;
    timerFill.style.width = `${pct}%`;
    timerFill.className = 'debug-timer-fill';
    if (pct <= 20) timerFill.classList.add('danger');
    else if (pct <= 50) timerFill.classList.add('warn');
  }

  function updateProgress() {
    if (!progressText) return;
    const pct = Math.round((currentIndex / challenges.length) * 100);
    progressText.textContent = `Progresso: ${pct}%`;
  }

  function tick() {
    timeLeft -= 1;
    updateStatus();
    updateTimerBar();
    if (timeLeft <= 0) {
      clearInterval(timer);
      locked = true;
      streak = 0;
      const current = challenges[currentIndex];
      feedbackEl.textContent = `Tempo esgotado! A resposta correta era: "${current.options[current.answer]}"`;
      feedbackEl.className = 'debug-feedback wrong';
      if (explanationEl) {
        explanationEl.textContent = current.explanation;
        explanationEl.style.display = 'block';
      }
      highlightCorrect(current.answer);
      setTimeout(nextChallenge, 2500);
    }
  }

  function highlightCorrect(correctIdx) {
    const btns = optionsEl.querySelectorAll('.btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
    });
  }

  function handleAnswer(answerIdx, buttons) {
    if (ended || locked) return;
    locked = true;
    clearInterval(timer);

    const current = challenges[currentIndex];
    const correctIdx = current.answer;

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
      if (idx === answerIdx && answerIdx !== correctIdx) btn.classList.add('wrong');
    });

    if (answerIdx === correctIdx) {
      score += 1;
      streak += 1;
      if (streak > bestStreak) bestStreak = streak;
      feedbackEl.textContent = streak > 1 ? `Correto! 🔥 Sequência de ${streak}` : 'Correto!';
      feedbackEl.className = 'debug-feedback correct';
    } else {
      streak = 0;
      feedbackEl.textContent = `Incorreto. A resposta era: "${current.options[correctIdx]}"`;
      feedbackEl.className = 'debug-feedback wrong';
    }

    if (explanationEl) {
      explanationEl.textContent = current.explanation;
      explanationEl.style.display = 'block';
    }

    updateStatus();
    setTimeout(nextChallenge, 2200);
  }

  function nextChallenge() {
    currentIndex += 1;
    feedbackEl.textContent = '';
    feedbackEl.className = 'debug-feedback';
    if (explanationEl) {
      explanationEl.textContent = '';
      explanationEl.style.display = 'none';
    }
    locked = false;

    if (currentIndex >= challenges.length) {
      finish();
      return;
    }
    renderChallenge();
  }

  function renderChallenge() {
    const current = challenges[currentIndex];
    ended = false;
    timeLeft = TIME_PER_ROUND;
    optionsEl.innerHTML = '';

    codeEl.textContent = current.code;
    questionEl.textContent = current.question;

    if (difficultyTag) {
      const d = DIFFICULTY_LABELS[current.difficulty];
      difficultyTag.textContent = d.text;
      difficultyTag.style.background = d.color;
    }

    const buttons = [];
    current.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      button.textContent = option;
      button.addEventListener('click', () => handleAnswer(index, buttons));
      optionsEl.appendChild(button);
      buttons.push(button);
    });

    updateStatus();
    updateTimerBar();
    updateProgress();
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  function finish() {
    clearInterval(timer);
    ended = true;
    const total = challenges.length;
    const isNewBest = score > bestScore();
    if (isNewBest) saveBest(score);

    codeEl.textContent = '// Parabéns! Desafio completo! 🎉';
    questionEl.textContent = 'Fim do Debug Challenge!';
    optionsEl.innerHTML = '';

    const diffLabel = selectedDifficulty === 'todas' ? 'Todas' : DIFFICULTY_LABELS[selectedDifficulty]?.text || selectedDifficulty;
    feedbackEl.textContent = `Acertos: ${score}/${total} (${diffLabel}) · Melhor sequência: ${bestStreak}${isNewBest ? ' · Novo recorde!' : ''}`;
    feedbackEl.className = 'debug-feedback';
    statusEl.textContent = `Finalizado · Melhor: ${bestScore()}`;
    if (difficultyTag) difficultyTag.textContent = '';
    if (timerFill) timerFill.style.width = '0%';
    if (progressText) progressText.textContent = 'Progresso: 100%';
    if (explanationEl) {
      explanationEl.textContent = '';
      explanationEl.style.display = 'none';
    }

    if (score >= total * 0.7) fireConfetti();
  }

  function resetGame() {
    clearInterval(timer);
    currentIndex = 0;
    score = 0;
    streak = 0;
    bestStreak = 0;
    ended = false;
    locked = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'debug-feedback';
    optionsEl.innerHTML = '';
    if (explanationEl) {
      explanationEl.textContent = '';
      explanationEl.style.display = 'none';
    }

    const pool = selectedDifficulty === 'todas'
      ? CHALLENGES
      : CHALLENGES.filter(c => c.difficulty === selectedDifficulty);

    challenges = shuffle(pool).slice(0, ROUNDS);
    renderChallenge();
  }

  function backToDifficulty() {
    clearInterval(timer);
    ended = true;
    optionsEl.innerHTML = '';
    codeEl.textContent = '';
    questionEl.textContent = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'debug-feedback';
    statusEl.textContent = '';
    if (difficultyTag) difficultyTag.textContent = '';
    if (timerFill) timerFill.style.width = '100%';
    if (progressText) progressText.textContent = '';
    if (explanationEl) {
      explanationEl.textContent = '';
      explanationEl.style.display = 'none';
    }
    showDifficultySelect();
  }

  async function shareResult() {
    const total = challenges.length;
    const diffLabel = selectedDifficulty === 'todas' ? 'Todas' : DIFFICULTY_LABELS[selectedDifficulty]?.text || selectedDifficulty;
    const text = `No Debug Challenge (${diffLabel}) acertei ${score}/${total} bugs no GameTools! 🐛`;
    if (navigator.share) {
      await navigator.share({ title: 'Debug Challenge - GameTools', text });
      return;
    }
    copyToClipboard(text, shareBtn);
  }

  const backBtn = document.getElementById('debug-back');
  if (backBtn) backBtn.addEventListener('click', backToDifficulty);

  resetBtn.addEventListener('click', resetGame);
  shareBtn.addEventListener('click', () => {
    shareResult().catch(() => {
      feedbackEl.textContent = 'Falha ao compartilhar resultado.';
    });
  });

  buildDifficultyGrid();
  showDifficultySelect();
}
