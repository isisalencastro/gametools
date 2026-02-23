'use client';

import { useMemo, useState } from 'react';

export default function TemperaturaPage() {
  const [celsius, setCelsius] = useState('25');

  const converted = useMemo(() => {
    const c = Number(celsius);
    if (Number.isNaN(c)) return null;
    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;
    return { f, k };
  }, [celsius]);

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">Conversor de Temperatura</h1>
      <div className="card space-y-4">
        <label className="text-sm font-semibold">Celsius (°C)</label>
        <input className="w-full rounded-xl border p-3" type="number" value={celsius} onChange={(e) => setCelsius(e.target.value)} />
      </div>
      {converted && (
        <div className="card bg-slate-50">
          <p>Fahrenheit: <strong>{converted.f.toFixed(2)} °F</strong></p>
          <p className="mt-2">Kelvin: <strong>{converted.k.toFixed(2)} K</strong></p>
        </div>
      )}
    </section>
  );
}
