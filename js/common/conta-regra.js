/*
 * A regra da conta, em um lugar so: e o que o gerador calcula em Python e o que o navegador
 * confere no JavaScript. Modulo puro, sem DOM, para poder ser testado por execucao
 * (scripts/conferir_conta_do_dia.mjs).
 *
 * Regra: numeros inteiros sem zero a esquerda, + - * /, sem parenteses, sem virgula, divisao
 * so exata, e a conta precisa ter pelo menos um operador. Precedencia normal: multiplicacao e
 * divisao antes de soma e subtracao, da esquerda para a direita dentro de cada nivel.
 */

/** Troca os sinais de teclado de celular pelos sinais que a regra entende. */
export function normalizar(texto) {
  return String(texto || "")
    .replace(/[×✕✖]/g, "*")
    .replace(/[÷]/g, "/")
    .replace(/[xX]/g, "*")
    .replace(/[,\s]/g, "");
}

/** A conta precisa ter pelo menos um sinal: sem isso, escrever o proprio alvo fecharia o dia. */
export function temOperador(conta) {
  return /[+\-*/]/.test(String(conta || ""));
}

/** Devolve { valor, motivo }: valor nulo quando a conta nao vale, com o motivo em portugues. */
export function analisar(conta) {
  if (!conta) return { valor: null, motivo: "escreva a conta" };
  if (!/^[0-9]+([+\-*/][0-9]+)*$/.test(conta)) {
    return { valor: null, motivo: "use apenas numeros e + - x /, sempre numero antes e depois do sinal" };
  }
  for (const numero of conta.match(/[0-9]+/g) || []) {
    if (numero.length > 1 && numero[0] === "0") {
      return { valor: null, motivo: "numero com zero a esquerda" };
    }
  }
  let total = 0;
  let sinal = 1;
  const partes = conta.split(/([+\-])/);
  for (let indice = 0; indice < partes.length; indice += 1) {
    const pedaco = partes[indice];
    if (indice % 2 === 1) {
      sinal = pedaco === "+" ? 1 : -1;
      continue;
    }
    const pedacos = pedaco.split(/([*/])/);
    let valor = Number(pedacos[0]);
    for (let posicao = 1; posicao < pedacos.length; posicao += 2) {
      const operador = pedacos[posicao];
      const outro = Number(pedacos[posicao + 1]);
      if (operador === "*") {
        valor *= outro;
      } else {
        if (outro === 0) return { valor: null, motivo: "divisao por zero" };
        if (valor % outro !== 0) return { valor: null, motivo: "essa divisao nao da numero inteiro" };
        valor /= outro;
      }
    }
    total += sinal * valor;
  }
  return { valor: total, motivo: null };
}

/** Sinais de multiplicacao e divisao como quem joga escreve. */
export function formatarConta(conta) {
  return String(conta || "").replace(/\*/g, "×").replace(/\//g, "÷");
}
