/*
 * Confere a regra da conta do navegador contra o gerador em Python, por execucao.
 *
 * Duas coisas sao testadas, e as duas importam:
 *
 * 1. Paridade: para cada conta do corpus (gerado pelo Python, com o valor que o Python
 *    calculou), o modulo do navegador tem de dar o mesmo valor. Regra escrita duas vezes
 *    diverge na primeira pressa, e a divergencia aparece como "sua conta nao fecha" na tela.
 * 2. O arquivo do ano: cada dia e reavaliado aqui, em outra linguagem, e nenhum alvo pode ter
 *    resposta mais curta que o teto anunciado (senao a tela estaria mentindo).
 *
 * Uso: node scripts/conferir_conta_do_dia.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { analisar, formatarConta, normalizar, temOperador } from "../js/common/conta-regra.js";

const aqui = dirname(fileURLToPath(import.meta.url));
const problemas = [];

/* ------------------------------------------------------------------ 1. paridade */

const corpus = JSON.parse(readFileSync(join(aqui, "corpus-conta.json"), "utf8"));
let conferidos = 0;
let nulos = 0;
for (const [conta, esperado] of corpus.casos) {
  const { valor } = analisar(conta);
  conferidos += 1;
  if (esperado === null) nulos += 1;
  if (valor !== esperado) {
    problemas.push(`paridade: ${conta} deu ${valor} no navegador, ${esperado} no Python`);
  }
}
console.log(`paridade: ${conferidos} contas conferidas, ${nulos} delas sem valor (esperado null)`);

/* ------------------------------------------------------------------ 2. casos de borda */

const bordas = [
  ["", null], ["+", null], ["3+", null], ["+3", null], ["3++4", null],
  ["03+1", null], ["3+04", null], ["8/0", null], ["7/2", null], ["5*-3", null],
  ["3 4", null], ["1,5+1", null], ["(2+3)*4", null], ["2**3", null],
  ["8/2", 4], ["100/4/5", 5], ["2*3*4", 24], ["999-99", 900], ["10*99", 990],
  ["5-8+3", 0], ["1+2*3", 7], ["3", 3], ["(nao deveria passar)", null],
];
// A regra "precisa ter um sinal" e do jogo, nao do avaliador: o avaliador so calcula. Ela vive
// aqui em cima porque sem ela o dia se fecharia escrevendo o proprio alvo.
const semSinal = [["3", false], ["408", false], ["3+4", true], ["51*8", true], ["100/4", true]];
for (const [conta, esperado] of semSinal) {
  if (temOperador(conta) !== esperado) problemas.push(`temOperador: "${conta}" deu ${temOperador(conta)}`);
}
for (const [conta, esperado] of bordas) {
  const { valor } = analisar(conta);
  if (valor !== esperado) {
    problemas.push(`borda: "${conta}" deu ${valor}, esperado ${esperado}`);
  }
}
const sinais = [["3x4", "3*4"], ["3×4", "3*4"], ["9÷3", "9/3"], ["3 X 4", "3*4"], ["1,5", "15"]];
for (const [entrada, esperado] of sinais) {
  const saida = normalizar(entrada);
  if (saida !== esperado) problemas.push(`normalizar: "${entrada}" virou "${saida}", esperado "${esperado}"`);
}
if (formatarConta("51*8") !== "51×8") problemas.push("formatarConta nao trocou o sinal de multiplicacao");
console.log(`bordas: ${bordas.length} casos invalidos ou de limite, ${sinais.length} casos de sinal`);

/* ------------------------------------------------------------------ 3. o arquivo do ano */

/** Todas as contas bem formadas com exatamente esse tanto de caracteres, como no Python. */
function contas(quantidadeCaracteres) {
  const saida = [];
  const numeros = (quantidade) => {
    if (quantidade === 1) return "0123456789".split("");
    const inicio = 10 ** (quantidade - 1);
    return Array.from({ length: inicio * 9 }, (_, i) => String(inicio + i));
  };
  const montar = (prefixo, digitos) => {
    if (digitos.length === 0) {
      saida.push(prefixo.join(""));
      return;
    }
    for (const operador of "+-*/") {
      for (const numero of numeros(digitos[0])) montar([...prefixo, operador, numero], digitos.slice(1));
    }
  };
  const reparticoes = (espaco, partes) => {
    if (partes === 1) return [[espaco]];
    const lista = [];
    for (let primeiro = 1; primeiro <= espaco - partes + 1; primeiro += 1) {
      for (const resto of reparticoes(espaco - primeiro, partes - 1)) {
        lista.push([primeiro, ...resto]);
      }
    }
    return lista;
  };
  for (let quantidadeNumeros = 2; quantidadeNumeros <= Math.floor(quantidadeCaracteres / 2) + 1; quantidadeNumeros += 1) {
    const sobra = quantidadeCaracteres - (quantidadeNumeros - 1);
    if (sobra < quantidadeNumeros) continue;
    for (const digitos of reparticoes(sobra, quantidadeNumeros)) {
      if (Math.max(...digitos) > 3) continue;
      for (const inicio of numeros(digitos[0])) montar([inicio], digitos.slice(1));
    }
  }
  return saida;
}

const jogo = JSON.parse(readFileSync(join(aqui, "..", "assets", "data", "conta-do-dia.json"), "utf8"));
const alcancaveis = new Map(); // valor -> menor tamanho, ate 5 caracteres (menos que o maior teto)
for (const quantidade of [3, 4, 5]) {
  for (const conta of contas(quantidade)) {
    const { valor } = analisar(conta);
    if (valor === null || valor < 10 || valor > 9999) continue;
    if (!alcancaveis.has(valor)) alcancaveis.set(valor, quantidade);
  }
}
for (const dia of jogo.dias) {
  const { valor } = analisar(dia.exemplo);
  if (valor !== dia.alvo) problemas.push(`dia ${dia.n}: exemplo ${dia.exemplo} deu ${valor}, esperado ${dia.alvo}`);
  if (dia.exemplo.length !== dia.caracteres) {
    problemas.push(`dia ${dia.n}: exemplo com ${dia.exemplo.length} caracteres, esperado ${dia.caracteres}`);
  }
  const menor = alcancaveis.get(dia.alvo);
  if (dia.caracteres > 3 && menor !== undefined && menor < dia.caracteres) {
    problemas.push(`dia ${dia.n}: alvo ${dia.alvo} tem resposta de ${menor} caracteres, teto anunciado ${dia.caracteres}`);
  }
}
console.log(`arquivo: ${jogo.dias.length} dias conferidos em outra linguagem`);

/* ------------------------------------------------------------------ resultado */

if (problemas.length) {
  for (const problema of problemas.slice(0, 20)) console.log("PROBLEMA:", problema);
  console.log(`${problemas.length} problemas no total`);
  process.exit(1);
}
console.log("tudo conferido: regra igual nos dois lados, arquivo do ano coerente");
