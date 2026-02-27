import { copyToClipboard, formatCurrency, formatNumber, setLiveRegion } from '../common/utils.js';

const MAX_PERIODOS_TABELA = 120;

function buildEvolutionTable(tipo, capital, taxaDecimal, tempo) {
  const rows = [];
  const periodos = Math.min(Math.floor(tempo), MAX_PERIODOS_TABELA);

  if (tipo === 'simples') {
    for (let t = 1; t <= periodos; t++) {
      const juros = capital * taxaDecimal * t;
      rows.push({ t, juros, montante: capital + juros });
    }
  } else {
    for (let t = 1; t <= periodos; t++) {
      const montante = capital * (1 + taxaDecimal) ** t;
      rows.push({ t, juros: montante - capital, montante });
    }
  }
  return rows;
}

function renderTable(container, rows) {
  if (!container) return;
  if (rows.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="juros-table-wrap"><table class="juros-table">';
  html += '<thead><tr><th>Período</th><th>Juros acumulados</th><th>Montante</th></tr></thead><tbody>';
  for (const r of rows) {
    html += `<tr><td>${r.t}</td><td>${formatCurrency(r.juros)}</td><td>${formatCurrency(r.montante)}</td></tr>`;
  }
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

export function initJurosFeature() {
  const resultado = document.getElementById('resultado');
  const calcular = document.getElementById('calcular');
  const copiar = document.getElementById('copiar');
  const tipoInput = document.getElementById('tipo');
  const capitalInput = document.getElementById('capital');
  const taxaInput = document.getElementById('taxa');
  const tempoInput = document.getElementById('tempo');
  const tabelaContainer = document.getElementById('juros-tabela');

  if (!resultado || !calcular || !copiar || !tipoInput || !capitalInput || !taxaInput || !tempoInput) return;

  setLiveRegion(resultado);

  const limite = 1e12;

  function lerPositivo(inputElement, nome) {
    const raw = inputElement.value.trim();
    if (raw === '') return `${nome}: campo obrigatório.`;
    const n = Number(raw);
    if (!Number.isFinite(n)) return `${nome}: valor inválido.`;
    if (n <= 0) return `${nome}: deve ser maior que zero.`;
    if (n > limite) return `${nome}: valor muito alto.`;
    return n;
  }

  calcular.addEventListener('click', () => {
    const tipo = tipoInput.value;
    const capital = lerPositivo(capitalInput, 'Capital');
    const taxa = lerPositivo(taxaInput, 'Taxa');
    const tempo = lerPositivo(tempoInput, 'Tempo');

    if (typeof capital === 'string' || typeof taxa === 'string' || typeof tempo === 'string') {
      resultado.textContent = [capital, taxa, tempo].filter((v) => typeof v === 'string').join(' ');
      if (tabelaContainer) tabelaContainer.innerHTML = '';
      return;
    }

    const i = taxa / 100;

    if (tipo === 'simples') {
      const juros = capital * i * tempo;
      const montante = capital + juros;
      resultado.textContent =
        `Juros simples: J = C × i × t = ${formatCurrency(capital)} × ${formatNumber(i, 'pt-BR', 4)} × ${tempo} = ${formatCurrency(juros)}. ` +
        `Montante: ${formatCurrency(montante)}.`;
      renderTable(tabelaContainer, buildEvolutionTable('simples', capital, i, tempo));
      return;
    }

    const montante = capital * (1 + i) ** tempo;
    const juros = montante - capital;
    resultado.textContent =
      `Juros compostos: M = C × (1 + i)^t = ${formatCurrency(capital)} × (1 + ${formatNumber(i, 'pt-BR', 4)})^${tempo} = ${formatCurrency(montante)}. ` +
      `Juros: ${formatCurrency(juros)}.`;
    renderTable(tabelaContainer, buildEvolutionTable('compostos', capital, i, tempo));
  });

  copiar.addEventListener('click', () => {
    copyToClipboard(resultado.textContent, copiar);
  });
}
