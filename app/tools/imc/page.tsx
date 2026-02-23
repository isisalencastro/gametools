'use client';

import { useMemo, useState } from 'react';

function getClassificacao(imc: number) {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade grau I';
  if (imc < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

export default function ImcPage() {
  const [peso, setPeso] = useState('70');
  const [altura, setAltura] = useState('1.75');

  const resultado = useMemo(() => {
    const p = Number(peso);
    const a = Number(altura);
    if (!p || !a) return null;
    const imc = p / (a * a);
    return {
      imc,
      classificacao: getClassificacao(imc)
    };
  }, [peso, altura]);

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">Calculadora de IMC</h1>
      <div className="card space-y-4">
        <label className="block text-sm font-semibold">Peso (kg)</label>
        <input className="w-full rounded-xl border p-3" type="number" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <label className="block text-sm font-semibold">Altura (m)</label>
        <input className="w-full rounded-xl border p-3" step="0.01" type="number" value={altura} onChange={(e) => setAltura(e.target.value)} />
      </div>
      {resultado && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm text-slate-600">Seu IMC</p>
          <p className="text-3xl font-extrabold text-brand-blue">{resultado.imc.toFixed(2)}</p>
          <p className="mt-1 font-semibold">{resultado.classificacao}</p>
        </div>
      )}
    </section>
  );
}
