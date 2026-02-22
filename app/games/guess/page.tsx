'use client';

import { useState } from 'react';

export default function GuessPage() {
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [tips, setTips] = useState<string[]>([]);

  const tryGuess = () => {
    const n = Number(guess);
    if (!n || n < 1 || n > 100) {
      setTips((prev) => ['Digite um número de 1 a 100.', ...prev]);
      return;
    }
    if (n === secret) {
      setTips((prev) => [`Acertou! O número era ${secret}. Novo número gerado!`, ...prev]);
      setSecret(Math.floor(Math.random() * 100) + 1);
      setGuess('');
      return;
    }
    setTips((prev) => [n > secret ? 'Muito alto!' : 'Muito baixo!', ...prev]);
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">Adivinhe o Número</h1>
      <div className="card space-y-3">
        <input
          className="w-full rounded-xl border p-3"
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Número entre 1 e 100"
        />
        <button className="btn-primary" onClick={tryGuess}>Tentar</button>
      </div>
      <div className="card">
        <h2 className="font-bold">Dicas</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {tips.slice(0, 8).map((tip, i) => (
            <li key={`${tip}-${i}`}>{tip}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
