export function initRuleOfThreeFeature() {
  const tipo = document.getElementById('tipo');
  const simplesArea = document.getElementById('simples-area');
  const compostaArea = document.getElementById('composta-area');
  const resultado = document.getElementById('resultado');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');

  if (!tipo || !simplesArea || !compostaArea || !resultado || !calcular || !copiar) return;

  const maxAbs = 1e9;

  function parseValid(id, label) {
    const el = document.getElementById(id);
    const raw = el?.value.trim() || '';
    if (raw === '') return { ok: false, msg: `${label}: campo obrigatório.` };
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, msg: `${label}: valor inválido.` };
    if (n === 0) return { ok: false, msg: `${label}: não pode ser zero.` };
    if (Math.abs(n) > maxAbs) return { ok: false, msg: `${label}: use valor entre -1.000.000.000 e 1.000.000.000.` };
    return { ok: true, value: n };
  }

  tipo.addEventListener('change', () => {
    const simples = tipo.value === 'simples';
    simplesArea.hidden = !simples;
    compostaArea.hidden = simples;
  });

  calcular.addEventListener('click', () => {
    if (tipo.value === 'simples') {
      const a = parseValid('a', 'A');
      const b = parseValid('b', 'B');
      const c = parseValid('c', 'C');
      if (!a.ok || !b.ok || !c.ok) {
        resultado.textContent = [a.msg, b.msg, c.msg].filter(Boolean).join(' ');
        return;
      }
      const x = (b.value * c.value) / a.value;
      resultado.textContent = `Resultado: x = ${x.toFixed(4)}. Fórmula: x = (B × C) / A = (${b.value} × ${c.value}) / ${a.value}.`;
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
    resultado.textContent = `Resultado composto: x = ${x.toFixed(4)}. Fórmula: x = base × v1 × v2 ÷ v3 = ${base.value} × ${v1.value} × ${v2.value} ÷ ${v3.value}.`;
  });

  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultado.textContent);
      resultado.textContent += ' (Resultado copiado!)';
    } catch {
      resultado.textContent += ' (Não foi possível copiar automaticamente.)';
    }
  });
}
