'use client';

import { useMemo, useState } from 'react';

export default function PorcentagemPage() {
  const [valor, setValor] = useState('100');
  const [percentual, setPercentual] = useState('10');

  const resultado = useMemo(() => {
    const v = Number(valor);
    const p = Number(percentual);
    if (Number.isNaN(v) || Number.isNaN(p)) return null;
    const parte = (v * p) / 100;
    const aumento = v + parte;
    const desconto = v - parte;
    return { parte, aumento, desconto };
  }, [valor, percentual]);

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">Calculadora de Porcentagem</h1>
      <div className="card space-y-4">
        <input className="w-full rounded-xl border p-3" type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor base" />
        <input className="w-full rounded-xl border p-3" type="number" value={percentual} onChange={(e) => setPercentual(e.target.value)} placeholder="Percentual" />
      </div>
      {resultado && (
        <div className="card bg-slate-50">
          <p>{percentual}% de {valor} = <strong>{resultado.parte.toFixed(2)}</strong></p>
          <p className="mt-2">Valor com aumento: <strong>{resultado.aumento.toFixed(2)}</strong></p>
          <p className="mt-2">Valor com desconto: <strong>{resultado.desconto.toFixed(2)}</strong></p>
        </div>
      )}
    </section>
  );
}
