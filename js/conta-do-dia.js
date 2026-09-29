/*
 * A Conta do dia: o segundo jogo diario dos Jogos IBA.
 *
 * Regra: todo dia um alvo e um teto de caracteres. Ganha quem escreve qualquer conta valida,
 * dentro do teto, que chegue no alvo. Numeros, + - x /, divisao so exata, sem parenteses,
 * sem zero a esquerda.
 *
 * Tres decisoes, herdadas do No do dia (o jogo irmao):
 *
 * 1. O jogo valida REGRA, nao gabarito. Qualquer conta que chegue no alvo vence, e o arquivo
 *    publicado traz uma resposta unica e exclusivamente para o botao "ver a resposta".
 * 2. O dia do jogo e o dia do Brasil (-03), nunca o relogio do aparelho: aparelho em UTC
 *    passa a meia-noite de Londres e receberia a conta de amanha.
 * 3. Chave de armazenamento nova (iba:conta-do-dia:v1). Reaproveitar chave de outro jogo zera
 *    o recorde de quem ja jogava o outro.
 *
 * O teto de cada dia e o MENOR numero de caracteres que chega naquele alvo, calculado por
 * forca bruta no gerador (../scripts/gerar_conta_do_dia.py). Por isso a tela pode dizer
 * "no maximo N caracteres" sem perder o aperto: nao existe conta mais curta para o alvo.
 */

// A regra da conta mora em um lugar so, e o mesmo modulo que o teste de paridade usa contra o
// gerador em Python. Duas copias da mesma regra divergem na primeira pressa.
import { analisar, formatarConta, normalizar, temOperador } from "./common/conta-regra.js";

const CAMINHO_DADOS = "../assets/data/conta-do-dia.json";
const CHAVE_ESTADO = "iba:conta-do-dia:v1";
const MAXIMO_TENTATIVAS = 6;
// Medicao: por padrao nada sai daqui. Quem quiser contar partidas por dia troca null pelo
// endereco do proprio coletor (o webhook do n8n da casa serve). Sem esse endereco, os eventos
// ficam so no navegador de quem joga.
const ENDERECO_EVENTOS = null;

const SEGUNDOS_DO_POPUP = 4;

const estado = {
  dados: null,
  dia: null,
  digitado: "",
  tentativas: [],
  venceu: false,
  perdeu: false,
  comecou: 0,
  eventoIniciado: false,
};

/* ------------------------------------------------------------------ armazenamento */

/** Testa se o navegador deixa guardar. O navegador embutido do WhatsApp e do Instagram nao deixa. */
function memoriaDisponivel() {
  try {
    const sonda = `${CHAVE_ESTADO}:sonda`;
    localStorage.setItem(sonda, "1");
    localStorage.removeItem(sonda);
    return true;
  } catch {
    return false;
  }
}

function estadoVazio() {
  return {
    jogados: 0,
    vitorias: 0,
    sequencia: 0,
    recorde: 0,
    ultimoDia: null,
    ultimoDiaVitoria: null,
    historico: [],
    progresso: null,
  };
}

function lerEstado() {
  try {
    const bruto = localStorage.getItem(CHAVE_ESTADO);
    return bruto ? { ...estadoVazio(), ...JSON.parse(bruto) } : estadoVazio();
  } catch {
    return estadoVazio();
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
  const registro = { evento, jogo: "conta-do-dia", dia: estado.dia ? estado.dia.n : null,
                     em: new Date().toISOString(), ...extra };
  if (ENDERECO_EVENTOS) {
    try {
      navigator.sendBeacon(ENDERECO_EVENTOS, JSON.stringify(registro));
    } catch {
      // se o coletor cair, o jogo nao pode cair junto
    }
  }
  return registro;
}

/** Guarda o progresso do dia para recarregar a pagina nao virar seis tentativas novas. */
function guardarProgresso() {
  const guardado = lerEstado();
  gravarEstado({
    ...guardado,
    progresso: {
      dia: estado.dia.data,
      tentativas: estado.tentativas,
      venceu: estado.venceu,
      perdeu: estado.perdeu,
    },
  });
}

/* ------------------------------------------------------------------ dia e hora do Brasil */

/** Data no fuso do Brasil, que e o dia do jogo. Ver o comentario 2 no topo do arquivo. */
function dataLocalIso(quando = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(quando);
  } catch {
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

/** Quanto falta para a meia-noite de Sao Paulo, e nao para a do aparelho. */
function minutosAteProximaVirada() {
  const agora = new Date();
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(agora);
  const ler = (tipo) => Number(partes.find((parte) => parte.type === tipo)?.value || 0);
  const passados = ler("hour") * 60 + ler("minute");
  return Math.max(0, 24 * 60 - passados);
}

/* ------------------------------------------------------------------ tela */

function avisarFalha(etapa, erro) {
  const alvo = document.getElementById("conta-mensagem");
  if (alvo) {
    alvo.textContent = `A conta de hoje não abriu (falhou em ${etapa}). ` +
      `Anote esta mensagem e avise: ${(erro && erro.message) || erro}`;
  }
  console.error("conta-do-dia:", etapa, erro);
}

function pintarCabecalho() {
  const dia = estado.dia;
  document.getElementById("conta-dia").textContent =
    `Conta nº ${dia.n}, de ${new Date(`${dia.data}T12:00:00`).toLocaleDateString("pt-BR")}.`;
  document.getElementById("conta-alvo").textContent = String(dia.alvo);
  document.getElementById("conta-teto").textContent =
    dia.caracteres === 1 ? "1 caractere" : `${dia.caracteres} caracteres`;
}

function pintarEntrada() {
  const entrada = document.getElementById("conta-entrada");
  const teto = estado.dia.caracteres;
  if (entrada.value !== estado.digitado) entrada.value = estado.digitado;
  const contador = document.getElementById("conta-contador");
  contador.textContent = `${estado.digitado.length} de ${teto}`;
  contador.classList.toggle("conta-contador-cheio", estado.digitado.length === teto);
  const enviar = document.getElementById("conta-enviar");
  enviar.disabled = estado.venceu || estado.perdeu || estado.digitado.length === 0;
}

function pintarTentativas() {
  const lista = document.getElementById("conta-tentativas");
  lista.innerHTML = "";
  estado.tentativas.forEach((tentativa) => {
    const linha = document.createElement("li");
    linha.className = "conta-tentativa";
    const situacao = tentativa.venceu
      ? "fechou a conta"
      : (tentativa.motivo ? `não vale: ${tentativa.motivo}` : `deu ${tentativa.valor}`);
    linha.classList.add(tentativa.venceu ? "conta-tentativa-certa" : "conta-tentativa-errada");
    // Nada aqui depende so de cor: cada linha diz em texto o que aconteceu e leva o simbolo.
    linha.textContent = `${tentativa.venceu ? "✓" : "×"} ${formatarConta(tentativa.conta)} = ` +
      `${tentativa.valor === null ? "?" : tentativa.valor} (${situacao})`;
    lista.appendChild(linha);
  });
  lista.hidden = estado.tentativas.length === 0;
}

function pintarMensagem() {
  const mensagem = document.getElementById("conta-mensagem");
  const restam = MAXIMO_TENTATIVAS - estado.tentativas.length;
  if (estado.venceu) {
    mensagem.textContent = "Conta fechada. A de hoje era essa.";
  } else if (estado.perdeu) {
    mensagem.textContent = "As seis tentativas de hoje acabaram. Amanhã tem conta nova.";
  } else if (estado.tentativas.length === 0) {
    mensagem.textContent = `Escreva uma conta com até ${estado.dia.caracteres} caracteres que chegue em ` +
      `${estado.dia.alvo}. Vale somar, subtrair, multiplicar e dividir.`;
  } else {
    mensagem.textContent = restam === 1
      ? "Falta uma tentativa. Cada envio mostra quanto a sua conta deu."
      : `Faltam ${restam} tentativas. Cada envio mostra quanto a sua conta deu.`;
  }
}

function pintar() {
  pintarCabecalho();
  pintarEntrada();
  pintarTentativas();
  pintarMensagem();
}

/* ------------------------------------------------------------------ jogar */

function escrever(texto) {
  if (estado.venceu || estado.perdeu) return;
  const teto = estado.dia.caracteres;
  const limpo = normalizar(texto);
  estado.digitado = limpo.slice(0, teto);
  if (!estado.eventoIniciado && estado.digitado) {
    estado.eventoIniciado = true;
    estado.comecou = Date.now();
    registrarEvento("partida_iniciada");
  }
  pintarEntrada();
}

function apagar() {
  if (estado.venceu || estado.perdeu) return;
  estado.digitado = estado.digitado.slice(0, -1);
  pintarEntrada();
}

function enviar() {
  if (estado.venceu || estado.perdeu) return;
  const conta = estado.digitado;
  if (!conta) return;
  // Duas checagens, e a ordem importa: primeiro se a conta vale, depois a regra do jogo de que
  // ela precisa ter um sinal. Sem a segunda, escrever o proprio alvo fecharia o dia (o alvo tem
  // 3 ou 4 digitos e o teto e 4, 5 ou 6 caracteres, entao ele sempre cabe).
  const analisado = analisar(conta);
  const motivo = analisado.motivo || (temOperador(conta) ? null : "escreva a conta com pelo menos um sinal");
  const valor = analisado.valor;
  const venceuAgora = motivo === null && valor === estado.dia.alvo;
  estado.tentativas.push({ conta, valor, motivo, venceu: venceuAgora });
  estado.digitado = "";

  if (venceuAgora) {
    verificarVitoria();
  } else if (estado.tentativas.length >= MAXIMO_TENTATIVAS) {
    estado.perdeu = true;
    const guardado = lerEstado();
    gravarEstado({
      ...guardado,
      jogados: (guardado.jogados || 0) + 1,
      sequencia: 0,
      ultimoDia: estado.dia.data,
      historico: [...(guardado.historico || []).slice(-364), { data: estado.dia.data, venceu: false }],
    });
    registrarEvento("partida_concluida", { venceu: false });
    mostrarResumo();
    document.getElementById("conta-compartilhar").hidden = false;
  }
  guardarProgresso();
  pintar();
}

function limparTentativas() {
  if (estado.venceu || estado.perdeu) return;
  estado.tentativas = [];
  estado.digitado = "";
  guardarProgresso();
  pintar();
}

function verificarVitoria() {
  if (estado.venceu) return;
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
    historico: [...(guardado.historico || []).slice(-364),
                { data: hoje, venceu: true, tentativas: estado.tentativas.length, segundos }],
  });

  registrarEvento("partida_concluida", { venceu: true, segundos });
  guardarProgresso();
  mostrarResumo(segundos);
  celebrar(segundos);
  document.getElementById("conta-compartilhar").hidden = false;
  pintar();
}

/** Mostra uma das contas possiveis. Pede a resposta, a sequencia volta a zero. */
function verResposta() {
  if (estado.venceu) return;
  estado.venceu = true;
  const dia = estado.dia;
  const guardado = lerEstado();
  gravarEstado({
    ...guardado,
    ultimoDia: dia.data,
    sequencia: 0,
    historico: [...(guardado.historico || []).slice(-364), { data: dia.data, venceu: false }],
  });
  guardarProgresso();
  pintar();
  document.getElementById("conta-mensagem").textContent =
    `Uma resposta: ${formatarConta(dia.exemplo)} = ${dia.alvo}. ` +
    `Existem ${dia.respostas} contas de ${dia.caracteres} caracteres que chegam nesse alvo. ` +
    `A sequência voltou a zero, e amanhã tem conta nova.`;
  document.getElementById("conta-compartilhar").hidden = false;
}

/* ------------------------------------------------------------------ comemoracao */

function esconderComemoracao() {
  const festa = document.getElementById("conta-festa");
  if (!festa || festa.hidden) return;
  festa.hidden = true;
  festa.classList.remove("no-festa-ativa");
  if (esconderComemoracao.prazo) {
    clearTimeout(esconderComemoracao.prazo);
    esconderComemoracao.prazo = null;
  }
  document.removeEventListener("keydown", escaparComemoracao);
}

function escaparComemoracao(evento) {
  if (evento.key === "Escape") esconderComemoracao();
}

function celebrar(segundos) {
  const festa = document.getElementById("conta-festa");
  if (!festa) return;
  const tempo = document.getElementById("conta-festa-tempo");
  if (tempo) {
    const tentativas = estado.tentativas.length;
    tempo.textContent = `Você fechou em ${tentativas} ${tentativas === 1 ? "tentativa" : "tentativas"}` +
      `${segundos ? `, em ${segundos} ${segundos === 1 ? "segundo" : "segundos"}` : ""}.`;
  }
  festa.hidden = false;
  festa.classList.add("no-festa-ativa");

  const fechar = document.getElementById("conta-festa-fechar");
  if (fechar && !fechar.dataset.ligado) {
    fechar.dataset.ligado = "1";
    fechar.addEventListener("click", esconderComemoracao);
    const fundo = festa.querySelector(".no-festa-fundo");
    if (fundo) fundo.addEventListener("click", esconderComemoracao);
    document.addEventListener("keydown", escaparComemoracao);
  }
  if (esconderComemoracao.prazo) clearTimeout(esconderComemoracao.prazo);
  esconderComemoracao.prazo = setTimeout(esconderComemoracao, SEGUNDOS_DO_POPUP * 1000);
}

/* ------------------------------------------------------------------ resumo e compartilhar */

function mostrarResumo(segundos) {
  const guardado = lerEstado();
  document.getElementById("conta-resumo").hidden = false;
  document.getElementById("conta-sequencia").textContent = `Sequência: ${guardado.sequencia || 0}`;
  document.getElementById("conta-jogados").textContent = `Jogadas: ${guardado.jogados || 0}`;
  document.getElementById("conta-vitorias").textContent = `Venceu: ${guardado.vitorias || 0}`;
  const legenda = segundos
    ? `Você fechou a conta em ${segundos} ${segundos === 1 ? "segundo" : "segundos"}.`
    : "";
  document.getElementById("conta-legenda").textContent = memoriaDisponivel()
    ? legenda
    : `${legenda} Este navegador não deixa o jogo guardar a sequência; para a sequência valer, ` +
      "abra no navegador do celular.";
}

function montarCompartilhamento() {
  const guardado = lerEstado();
  const linhas = estado.tentativas.map((tentativa) => (tentativa.venceu ? "🟩" : "🟥")).join("");
  const sequencia = guardado.sequencia || 0;
  return [
    `A Conta do dia #${estado.dia.n}`,
    `Alvo ${estado.dia.alvo}, até ${estado.dia.caracteres} caracteres`,
    `${sequencia} ${sequencia === 1 ? "dia" : "dias"} de sequência`,
    "",
    linhas,
    "",
    "https://jogos.ibaestudio.com/jogos/conta-do-dia.html",
  ].join("\n");
}

async function compartilhar() {
  const texto = montarCompartilhamento();
  const botao = document.getElementById("conta-compartilhar");
  // 1. No celular o melhor caminho e a folha do sistema.
  if (navigator.share) {
    try {
      await navigator.share({ title: "A Conta do dia", text: texto });
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
    // 3. Ultimo recurso, e o que salva no navegador embutido do WhatsApp e do Instagram, onde
    //    a folha do sistema e a area de transferencia estao bloqueadas: por o texto na tela,
    //    ja selecionado.
    const caixa = document.getElementById("conta-resultado-caixa");
    caixa.hidden = false;
    caixa.value = texto;
    caixa.focus();
    caixa.select();
    botao.textContent = "Toque em copiar";
  }
  setTimeout(() => { botao.textContent = "Compartilhar resultado"; }, 2500);
}

function mostrarProximo() {
  const alvo = document.getElementById("conta-proximo");
  if (!alvo) return;
  const atualizar = () => {
    const minutos = minutosAteProximaVirada();
    const horas = Math.floor(minutos / 60);
    alvo.textContent = `Conta nova em ${horas}h ${String(minutos % 60).padStart(2, "0")}min, ` +
      "à meia-noite de Brasília.";
  };
  atualizar();
  setInterval(atualizar, 60000);
}

/* ------------------------------------------------------------------ entrada */

function ligarTeclado() {
  const entrada = document.getElementById("conta-entrada");

  // Teclado do aparelho e teclado fisico passam pelo mesmo caminho: sanitiza e corta no teto.
  entrada.addEventListener("input", () => {
    escrever(entrada.value);
  });
  entrada.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      enviar();
    }
  });

  document.querySelectorAll("[data-conta-tecla]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const tecla = botao.dataset.contaTecla;
      if (tecla === "apagar") apagar();
      else if (tecla === "enviar") enviar();
      else escrever(estado.digitado + tecla);
    });
  });
}

/* ------------------------------------------------------------------ inicio */

async function iniciar() {
  let dados;
  try {
    const resposta = await fetch(CAMINHO_DADOS);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    dados = await resposta.json();
  } catch (erro) {
    document.getElementById("conta-mensagem").textContent =
      "Não consegui carregar a conta de hoje. Recarregue a página.";
    console.error("falha ao carregar as contas", erro);
    return;
  }
  estado.dados = dados;
  try {
    estado.dia = acharDiaDeHoje(dados);
    if (!estado.dia) throw new Error("o dia de hoje nao esta no arquivo de contas");
  } catch (erro) {
    avisarFalha("achar o dia de hoje", erro);
    return;
  }
  try {
    document.getElementById("conta-regras").textContent =
      `Alvo ${estado.dia.alvo}, no máximo ${estado.dia.caracteres} caracteres. ` +
      "Vale número, + - × ÷, sem parênteses; a divisão precisa dar número inteiro.";
    ligarTeclado();
    pintar();
  } catch (erro) {
    avisarFalha("montar a tela", erro);
    // O return e obrigatorio, como no No do dia: sem ele o resto do fluxo roda e repinta a
    // mensagem padrao por cima do aviso, e a pessoa ve uma tela muda e bonita.
    return;
  }

  mostrarProximo();
  const guardado = lerEstado();
  const progresso = guardado.progresso;
  if (progresso && progresso.dia === estado.dia.data) {
    estado.tentativas = Array.isArray(progresso.tentativas) ? progresso.tentativas : [];
    estado.venceu = Boolean(progresso.venceu);
    estado.perdeu = Boolean(progresso.perdeu);
    pintar();
  }
  if ((guardado.jogados || 0) > 0) mostrarResumo(0);
  if (estado.venceu || estado.perdeu) {
    document.getElementById("conta-compartilhar").hidden = false;
    const restantes = MAXIMO_TENTATIVAS - estado.tentativas.length;
    if (!estado.venceu && restantes > 0) estado.perdeu = false;
    pintar();
  }

  document.getElementById("conta-limpar").addEventListener("click", limparTentativas);
  document.getElementById("conta-resposta").addEventListener("click", verResposta);
  document.getElementById("conta-compartilhar").addEventListener("click", compartilhar);
}

iniciar();
