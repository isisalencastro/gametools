/*
 * O No do dia: jogo diario dos Jogos IBA (estudio IBA).
 *
 * Regras: oito pecas num tabuleiro 8x8, uma por linha, uma por coluna e uma por
 * regiao, sem nenhuma encostar na outra nem na diagonal.
 *
 * Decisao de projeto, tomada com medicao (ver o gerador em scripts/gerar_no_do_dia.py):
 * o jogo valida as QUATRO REGRAS, nao uma solucao guardada. Qualquer arranjo que
 * respeite linha, coluna, regiao e nao encoste e vitoria. A solucao que vem no arquivo
 * de dados serve apenas para quem pede a resposta. Isso e honesto com quem joga e
 * dispensa exigir tabuleiro de solucao unica, que nesse formato quase nunca aparece.
 *
 * Chave de armazenamento: jogo novo, chave nova. Nao reaproveitar chave de outro jogo,
 * porque isso zera o recorde de quem ja jogava o outro.
 */

const CAMINHO_DADOS = "../assets/data/no-do-dia.json";
const CHAVE_ESTADO = "iba:no-do-dia:v1";

// Medicao: por padrao nada sai daqui. Quem quiser contar partidas por dia troca null pelo
// endereco do proprio coletor (o webhook do n8n da casa serve) e passa a receber
// {evento, dia, em}. Sem esse endereco, os eventos ficam so no navegador de quem joga.
const ENDERECO_EVENTOS = null;

const estado = {
  dados: null,
  dia: null,
  tabuleiro: [],        // 8x8, cada casa guarda true quando tem peca
  conflitos: new Set(), // casas em conflito, no formato "linha,coluna"
  venceu: false,
  comecou: 0,
  eventoIniciado: false,
};

/** Testa se o navegador deixa guardar. O navegador embutido do WhatsApp e do Instagram nao deixa. */
function memoriaDisponivel() {
  try {
    const sonda = CHAVE_ESTADO + ":sonda";
    localStorage.setItem(sonda, "1");
    localStorage.removeItem(sonda);
    return true;
  } catch {
    return false;
  }
}

function lerEstado() {
  try {
    const bruto = localStorage.getItem(CHAVE_ESTADO);
    const base = { jogados: 0, vitorias: 0, sequencia: 0, recorde: 0,
                   ultimoDia: null, ultimoDiaVitoria: null, historico: [] };
    return bruto ? { ...base, ...JSON.parse(bruto) } : base;
  } catch {
    return { jogados: 0, vitorias: 0, sequencia: 0, recorde: 0,
             ultimoDia: null, ultimoDiaVitoria: null, historico: [] };
  }
}

function gravarEstado(dados) {
  try {
    localStorage.setItem(CHAVE_ESTADO, JSON.stringify(dados));
  } catch {
    // navegador sem armazenamento (aba privada): o jogo continua, so nao guarda o habito
  }
}

function registrarEvento(evento, extra = {}) {
  const registro = { evento, dia: estado.dia ? estado.dia.n : null, em: new Date().toISOString(), ...extra };
  if (ENDERECO_EVENTOS) {
    try {
      navigator.sendBeacon(ENDERECO_EVENTOS, JSON.stringify(registro));
    } catch {
      // se o coletor cair, o jogo nao pode cair junto
    }
  }
  return registro;
}

/** Data no fuso do Brasil (-03), que e o dia do jogo.
 *
 * Nao vale usar o relogio do aparelho: aparelho em UTC passa a meia-noite de Londres e
 * recebe o tabuleiro de amanha enquanto o Brasil ainda joga o de hoje. O dia do jogo tem
 * de virar a meia-noite de Porto Alegre, igual para todo mundo. Regra da casa: data da
 * IBA sempre em -03.
 */
function dataLocalIso(quando = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(quando);
  } catch {
    // Navegador sem suporte a fuso por nome: cai no fuso do aparelho.
    const ano = quando.getFullYear();
    const mes = String(quando.getMonth() + 1).padStart(2, "0");
    const dia = String(quando.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }
}

function diferencaEmDias(inicioIso, fimIso) {
  const inicio = new Date(`${inicioIso}T12:00:00`);
  const fim = new Date(`${fimIso}T12:00:00`);
  return Math.round((fim - inicio) / 86400000);
}

function acharDiaDeHoje(dados) {
  const hoje = dataLocalIso();
  const indice = diferencaEmDias(dados.inicio, hoje);
  const lista = dados.dias;
  if (indice < 0) return lista[0];
  if (indice >= lista.length) return lista[indice % lista.length];
  return lista[indice];
}

function montarTabuleiro(dia) {
  return dia.regioes.map((linha) => linha.split("").map(() => false));
}

function vizinhasDe(linha, coluna) {
  const saida = [];
  for (let dl = -1; dl <= 1; dl += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dl === 0 && dc === 0) continue;
      const l = linha + dl;
      const c = coluna + dc;
      if (l >= 0 && l < 8 && c >= 0 && c < 8) saida.push([l, c]);
    }
  }
  return saida;
}

function regiaoDe(linha, coluna) {
  return Number(estado.dia.regioes[linha][coluna]);
}

/** Marca em conflito toda peca que repete linha, coluna ou regiao, ou que encosta em outra. */
function acharConflitos(tabuleiro) {
  const conflitos = new Set();
  const linhas = new Map();
  const colunas = new Map();
  const regioes = new Map();
  const pecas = [];
  for (let l = 0; l < 8; l += 1) {
    for (let c = 0; c < 8; c += 1) {
      if (!tabuleiro[l][c]) continue;
      pecas.push([l, c]);
      for (const [mapa, chave] of [[linhas, l], [colunas, c], [regioes, regiaoDe(l, c)]]) {
        const lista = mapa.get(chave) || [];
        lista.push([l, c]);
        mapa.set(chave, lista);
      }
    }
  }
  for (const mapa of [linhas, colunas, regioes]) {
    for (const lista of mapa.values()) {
      if (lista.length > 1) lista.forEach(([l, c]) => conflitos.add(`${l},${c}`));
    }
  }
  for (let i = 0; i < pecas.length; i += 1) {
    for (let j = i + 1; j < pecas.length; j += 1) {
      const [a, b] = pecas[i];
      const [d, e] = pecas[j];
      if (Math.abs(a - d) <= 1 && Math.abs(b - e) <= 1) {
        conflitos.add(`${a},${b}`);
        conflitos.add(`${d},${e}`);
      }
    }
  }
  return conflitos;
}

function contarPecas(tabuleiro) {
  return tabuleiro.flat().filter(Boolean).length;
}

/**
 * Tons por regiao, calculados pela vizinhanca.
 *
 * Pintar regiao por indice nao funciona: duas regioes vizinhas caiam no mesmo tom e o
 * tabuleiro virava mancha (apontado na conferencia visual de 28/09/2026). Aqui monto o
 * grafo de regioes, pinto primeiro a mais vizinhada e dou a cada uma o menor tom que
 * nenhum vizinho ja usa. Assim regiao vizinha nunca repete cor.
 */
function tonsPorVizinhanca() {
  const vizinhos = Array.from({ length: 8 }, () => new Set());
  for (let l = 0; l < 8; l += 1) {
    for (let c = 0; c < 8; c += 1) {
      const aqui = regiaoDe(l, c);
      for (const [nl, nc] of [[l + 1, c], [l, c + 1], [l + 1, c + 1], [l + 1, c - 1]]) {
        if (nl > 7 || nc < 0 || nc > 7) continue;
        const la = regiaoDe(nl, nc);
        if (aqui !== la) {
          vizinhos[aqui].add(la);
          vizinhos[la].add(aqui);
        }
      }
    }
  }
  const cores = coresDosTons();
  const ordem = [0, 1, 2, 3, 4, 5, 6, 7].sort((a, b) => vizinhos[b].size - vizinhos[a].size);
  const tons = new Array(8).fill(0);
  const definido = new Array(8).fill(false);
  for (const regiao of ordem) {
    const usados = [...vizinhos[regiao]].filter((v) => definido[v]).map((v) => tons[v]);
    let melhor = 0;
    let melhorDistancia = -1;
    for (let tom = 0; tom < cores.length; tom += 1) {
      const distancia = usados.length
        ? Math.min(...usados.map((outro) => distanciaCor(cores[tom], cores[outro])))
        : 0;
      if (distancia > melhorDistancia) {
        melhorDistancia = distancia;
        melhor = tom;
      }
    }
    tons[regiao] = melhor;
    definido[regiao] = true;
  }
  return tons;
}

/** Cores dos tons lidas do proprio CSS: paleta duplicada em dois arquivos diverge. */
/** Ultimo recurso: se nem a leitura da paleta funcionar, estes sao os cinco tons do CSS. */
const PALETA_RESERVA = [[255, 255, 255], [195, 217, 244], [230, 232, 236], [150, 189, 236], [127, 169, 220]];

function coresDosTons() {
  const sonda = document.createElement("span");
  sonda.className = "no-casa";
  sonda.style.position = "absolute";
  sonda.style.visibility = "hidden";
  document.body.appendChild(sonda);
  const cores = [];
  for (let tom = 0; tom < 5; tom += 1) {
    sonda.dataset.tom = String(tom);
    const bruto = getComputedStyle(sonda).backgroundColor;
    const numeros = (bruto.match(/\d+/g) || [0, 0, 0]).map(Number);
    cores.push(numeros.slice(0, 3));
    if (cores[cores.length - 1].length < 3) cores[cores.length - 1] = [0, 0, 0];
  }
  sonda.remove();
  return cores;
}

/** Mostra na tela o que falhou. Pagina que falha em silencio custa horas de adivinhacao. */
function avisarFalha(etapa, erro) {
  const alvo = document.getElementById("no-mensagem");
  if (alvo) {
    alvo.textContent = `O tabuleiro de hoje não abriu (falhou em ${etapa}). ` +
      `Anote esta mensagem e avise: ${(erro && erro.message) || erro}`;
  }
  console.error("no-do-dia:", etapa, erro);
}

function distanciaCor(a, b) {
  return Math.sqrt(a.reduce((soma, valor, i) => soma + (valor - b[i]) ** 2, 0));
}

function desenhar() {
  const alvo = document.getElementById("no-tabuleiro");
  const aviso = alvo.querySelector(".no-carregando");
  if (aviso) aviso.remove();
  const tons = tonsPorVizinhanca();
  const pecas = [];
  for (let l = 0; l < 8; l += 1) {
    pecas.push([]);
    for (let c = 0; c < 8; c += 1) {
      const casa = document.createElement("button");
      casa.type = "button";
      casa.className = "no-casa";
      casa.dataset.linha = String(l);
      casa.dataset.coluna = String(c);
      casa.dataset.regiao = String(regiaoDe(l, c));
      casa.dataset.regiaoNumero = String(regiaoDe(l, c) + 1);
      casa.dataset.tom = String(tons[regiaoDe(l, c)]);
      casa.setAttribute("role", "gridcell");
      casa.setAttribute("aria-rowindex", String(l + 1));
      casa.setAttribute("aria-colindex", String(c + 1));
      casa.addEventListener("click", () => alternarPeca(l, c));
      casa.addEventListener("keydown", (evento) => andarComSetas(evento, l, c));
      alvo.appendChild(casa);
      pecas[l].push(casa);
    }
  }
  return pecas;
}

function andarComSetas(evento, linha, coluna) {
  const passo = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[evento.key];
  if (!passo) return;
  evento.preventDefault();
  const alvoLinha = Math.min(7, Math.max(0, linha + passo[0]));
  const alvoColuna = Math.min(7, Math.max(0, coluna + passo[1]));
  const alvo = document.querySelector(`.no-casa[data-linha="${alvoLinha}"][data-coluna="${alvoColuna}"]`);
  if (alvo) alvo.focus();
}

function pintar() {
  const casas = document.querySelectorAll(".no-casa");
  casas.forEach((casa) => {
    const l = Number(casa.dataset.linha);
    const c = Number(casa.dataset.coluna);
    const tem = estado.tabuleiro[l][c];
    const emConflito = estado.conflitos.has(`${l},${c}`);
    casa.classList.toggle("no-casa-cheia", tem);
    casa.classList.toggle("no-casa-conflito", emConflito);
    const regiao = regiaoDe(l, c);
    const estadoTexto = tem ? (emConflito ? "peça em conflito" : "peça") : "vazia";
    casa.setAttribute("aria-label", `linha ${l + 1}, coluna ${c + 1}, região ${regiao + 1}: ${estadoTexto}`);
    casa.setAttribute("aria-pressed", tem ? "true" : "false");
  });

  const mensagem = document.getElementById("no-mensagem");
  const total = contarPecas(estado.tabuleiro);
  if (estado.venceu) {
    mensagem.textContent = "Tabuleiro resolvido. O nó de hoje está desatado.";
  } else if (estado.conflitos.size > 0) {
    mensagem.textContent = `Há ${estado.conflitos.size} ${estado.conflitos.size === 1 ? "peça" : "peças"} em conflito. Marquei as casas: uma peça por linha, por coluna e por região, e nenhuma encostando em outra.`;
  } else if (total === 0) {
    mensagem.textContent = "Comece por uma região pequena e vá eliminando as casas impossíveis.";
  } else {
    mensagem.textContent = `${total} de 8 peças colocadas, nenhuma em conflito até agora.`;
  }
}

function verificarVitoria() {
  if (estado.venceu) return;
  if (contarPecas(estado.tabuleiro) !== 8) return;
  if (estado.conflitos.size !== 0) return;
  const agora = Date.now();
  const segundos = Math.max(1, Math.round((agora - estado.comecou) / 1000));
  estado.venceu = true;

  const guardado = lerEstado();
  const hoje = estado.dia.data;
  const ontem = dataLocalIso(new Date(new Date(`${hoje}T12:00:00`).getTime() - 86400000));
  const sequencia = guardado.ultimoDiaVitoria === ontem ? (guardado.sequencia || 0) + 1 : 1;

  gravarEstado({
    ...guardado,
    jogados: (guardado.jogados || 0) + 1,
    vitorias: (guardado.vitorias || 0) + 1,
    sequencia,
    recorde: Math.max(guardado.recorde || 0, sequencia),
    ultimoDia: hoje,
    ultimoDiaVitoria: hoje,
    historico: [...(guardado.historico || []).slice(-364), { data: hoje, venceu: true, segundos }],
  });

  registrarEvento("partida_concluida", { segundos });
  mostrarResumo(segundos);
  document.getElementById("no-compartilhar").hidden = false;
  // repinta depois de marcar a vitoria: a mensagem da tela tem de refletir o
  // estado final, e nao o texto de quando o tabuleiro ainda estava sendo montado
  pintar();
}

function mostrarResumo(segundos) {
  const guardado = lerEstado();
  document.getElementById("no-resumo").hidden = false;
  document.getElementById("no-sequencia").textContent = `Sequência: ${guardado.sequencia || 0}`;
  document.getElementById("no-jogados").textContent = `Jogados: ${guardado.jogados || 0}`;
  document.getElementById("no-vitorias").textContent = `Venceu: ${guardado.vitorias || 0}`;
  const legenda = segundos ? `Você desatou o nó em ${segundos} segundo(s).` : "";
  document.getElementById("no-legenda").textContent = memoriaDisponivel()
    ? legenda
    : `${legenda} Este navegador não deixa o jogo guardar a sequência; para a sequência valer, abra no navegador do celular.`;
}

function alternarPeca(linha, coluna) {
  if (estado.venceu) return;
  if (!estado.eventoIniciado) {
    estado.eventoIniciado = true;
    estado.comecou = Date.now();
    registrarEvento("partida_iniciada");
  }
  estado.tabuleiro[linha][coluna] = !estado.tabuleiro[linha][coluna];
  estado.conflitos = acharConflitos(estado.tabuleiro);
  pintar();
  verificarVitoria();
  if (!estado.venceu && contarPecas(estado.tabuleiro) === 8 && estado.conflitos.size > 0) {
    document.getElementById("no-mensagem").textContent += " Ainda não fecha: veja as casas marcadas.";
  }
}

function limparTabuleiro() {
  if (estado.venceu) return;
  estado.tabuleiro = montarTabuleiro(estado.dia);
  estado.conflitos = new Set();
  pintar();
}

function mostrarResposta() {
  if (estado.venceu) return;
  estado.venceu = true;
  estado.tabuleiro = montarTabuleiro(estado.dia);
  estado.dia.solucao.forEach(([l, c]) => { estado.tabuleiro[l][c] = true; });
  estado.conflitos = acharConflitos(estado.tabuleiro);
  pintar();
  const guardado = lerEstado();
  gravarEstado({ ...guardado, ultimoDia: estado.dia.data, sequencia: 0,
                 historico: [...(guardado.historico || []).slice(-364), { data: estado.dia.data, venceu: false }] });
  document.getElementById("no-mensagem").textContent =
    "Esta é uma das respostas possíveis. A sequência voltou a zero, e amanhã tem tabuleiro novo.";
}

function montarCompartilhamento() {
  const guardado = lerEstado();
  const linhas = estado.tabuleiro.map((linha) => linha.map((tem) => (tem ? "🟦" : "⬜")).join(""));
  const sequencia = guardado.sequencia || 1;
  return [
    `O Nó do dia #${estado.dia.n}`,
    `${sequencia} dia(s) de sequência`,
    "",
    ...linhas,
    "",
    "https://jogos.ibaestudio.com/jogos/no-do-dia.html",
  ].join("\n");
}

async function compartilhar() {
  const texto = montarCompartilhamento();
  const botao = document.getElementById("no-compartilhar");
  // 1. No celular o melhor caminho e a folha de compartilhar do proprio sistema.
  if (navigator.share) {
    try {
      await navigator.share({ title: "O Nó do dia", text: texto });
      botao.textContent = "Compartilhado";
      return;
    } catch (erro) {
      if (erro && erro.name === "AbortError") return; // a pessoa desistiu, nao e defeito
    }
  }
  // 2. Copiar para a area de transferencia.
  try {
    await navigator.clipboard.writeText(texto);
    botao.textContent = "Copiado";
    return;
  } catch {
    // 3. Ultimo recurso, e o que faltava: por o texto na tela, ja selecionado.
    //    Dizer "selecione e copie" sem nada para selecionar e beco sem saida, e e o que
    //    acontece no navegador embutido do WhatsApp e do Instagram, onde as duas vias
    //    de cima estao bloqueadas.
    const caixa = document.getElementById("no-resultado-caixa");
    caixa.hidden = false;
    caixa.value = texto;
    caixa.focus();
    caixa.select();
    botao.textContent = "Toque em copiar";
  }
  document.getElementById("no-legenda").textContent = texto.split("\n").slice(0, 2).join(" · ");
  setTimeout(() => { botao.textContent = "Compartilhar resultado"; }, 2500);
}

function mostrarProximo() {
  const alvo = document.getElementById("no-proximo");
  if (!alvo) return;
  const atualizar = () => {
    const agora = new Date();
    const proxima = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1, 0, 0, 0);
    const minutos = Math.max(0, Math.round((proxima - agora) / 60000));
    const horas = Math.floor(minutos / 60);
    alvo.textContent = `Tabuleiro novo em ${horas}h ${String(minutos % 60).padStart(2, "0")}min.`;
  };
  atualizar();
  setInterval(atualizar, 60000);
}

async function iniciar() {
  let dados;
  try {
    const resposta = await fetch(CAMINHO_DADOS);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    dados = await resposta.json();
  } catch (erro) {
    document.getElementById("no-mensagem").textContent =
      "Não consegui carregar o tabuleiro de hoje. Recarregue a página.";
    console.error("falha ao carregar os tabuleiros", erro);
    return;
  }
  estado.dados = dados;
  try {
    estado.dia = acharDiaDeHoje(dados);
    if (!estado.dia) throw new Error("o dia de hoje nao esta no arquivo de tabuleiros");
  } catch (erro) {
    avisarFalha("achar o dia de hoje", erro);
    return;
  }
  try {
    estado.tabuleiro = montarTabuleiro(estado.dia);
    desenhar();
  } catch (erro) {
    avisarFalha("desenhar o tabuleiro", erro);
    // O return e obrigatorio: sem ele o resto do fluxo roda e repinta a mensagem padrao
    // por cima do aviso, e a pessoa ve uma tela muda e bonita, que foi o report de 28/09/2026.
    return;
  }
  pintar();
  document.getElementById("no-dia").textContent =
    `Tabuleiro nº ${estado.dia.n}, de ${new Date(`${estado.dia.data}T12:00:00`).toLocaleDateString("pt-BR")}.`;
  mostrarProximo();
  const guardado = lerEstado();
  if ((guardado.jogados || 0) > 0) mostrarResumo(0);
  document.getElementById("no-limpar").addEventListener("click", limparTabuleiro);
  document.getElementById("no-resposta").addEventListener("click", mostrarResposta);
  document.getElementById("no-compartilhar").addEventListener("click", compartilhar);
}

iniciar();
