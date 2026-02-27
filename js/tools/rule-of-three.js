import { copyToClipboard, formatNumber, setLiveRegion } from '../common/utils.js';

export function initRuleOfThreeFeature() {
  const tipo = document.getElementById('tipo');
  const simplesArea = document.getElementById('simples-area');
  const compostaArea = document.getElementById('composta-area');
  const resultado = document.getElementById('resultado');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');
  const proporcao = document.getElementById('proporcao');

  if (!tipo || !simplesArea || !compostaArea || !resultado || !calcular || !copiar) return;

  setLiveRegion(resultado);

  const maxAbs = 1e9;

  function parseValid(id, label) {
    const el = document.getElementById(id);
    const raw = el?.value.trim() || '';
    if (raw === '') return { ok: false, msg: `${label}: campo obrigatório.` };
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, msg: `${label}: valor inválido.` };
    if (n === 0) return { ok: false, msg: `${label}: não pode ser zero.` };
    if (Math.abs(n) > maxAbs) return { ok: false, msg: `${label}: use valor entre -${formatNumber(maxAbs, 'pt-BR', 0)} e ${formatNumber(maxAbs, 'pt-BR', 0)}.` };
    return { ok: true, value: n };
  }

  tipo.addEventListener('change', () => {
    const simples = tipo.value === 'simples';
    simplesArea.hidden = !simples;
    compostaArea.hidden = simples;
  });

  function isInversa() {
    return proporcao && proporcao.value === 'inversa';
  }

  calcular.addEventListener('click', () => {
    if (tipo.value === 'simples') {
      const a = parseValid('a', 'A');
      const b = parseValid('b', 'B');
      const c = parseValid('c', 'C');
      if (!a.ok || !b.ok || !c.ok) {
        resultado.textContent = [a.msg, b.msg, c.msg].filter(Boolean).join(' ');
        return;
      }

      let x;
      let formula;
      if (isInversa()) {
        x = (a.value * b.value) / c.value;
        formula = `x = (A × B) / C = (${a.value} × ${b.value}) / ${c.value}`;
      } else {
        x = (b.value * c.value) / a.value;
        formula = `x = (B × C) / A = (${b.value} × ${c.value}) / ${a.value}`;
      }
      resultado.textContent = `Resultado: x = ${formatNumber(x, 'pt-BR', 4)}. Fórmula: ${formula}.`;
      return;
    }

    const base = parseValid('base', 'Valor base');
    const v1 = parseValid('v1', 'Variável 1');
    const v2 = parseValid('v2', 'Variável 2');
    const v3 = parseValid('v3', 'Variável 3');
    if (!base.ok || !v1.ok || !v2.ok || !v3.ok) {
      resultado.textContent = [base.msg, v1.msg, v2.msg, v3.msg].filter(Boolean).join(' ');
      return;
    }
    const x = (base.value * v1.value * v2.value) / v3.value;
    resultado.textContent = `Resultado composto: x = ${formatNumber(x, 'pt-BR', 4)}. Fórmula: x = base × v1 × v2 ÷ v3 = ${base.value} × ${v1.value} × ${v2.value} ÷ ${v3.value}.`;
  });

  copiar.addEventListener('click', () => {
    copyToClipboard(resultado.textContent, copiar);
  });
}
