'use client';

import { useEffect, useRef, useState } from 'react';

export default function ReactionPage() {
  const [status, setStatus] = useState<'idle' | 'waiting' | 'ready'>('idle');
  const [message, setMessage] = useState('Clique em iniciar para testar seu reflexo.');
  const [result, setResult] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const start = () => {
    setStatus('waiting');
    setMessage('Aguarde ficar amarelo...');
    setResult(null);
    const delay = 1500 + Math.random() * 2500;
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setStatus('ready');
      setMessage('AGORA! Clique!');
    }, delay);
  };

  const clickArea = () => {
    if (status === 'waiting') {
      setMessage('Queimou! Você clicou cedo demais.');
      setStatus('idle');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (status === 'ready') {
      const elapsed = performance.now() - startRef.current;
      setResult(elapsed);
      setStatus('idle');
      setMessage('Boa!');
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold">Teste de Reação</h1>
      <button className="btn-primary" onClick={start}>Iniciar</button>
      <button
        onClick={clickArea}
        className={`w-full rounded-2xl p-10 text-center text-xl font-bold transition ${
          status === 'ready' ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-blue text-white'
        }`}
      >
        {message}
      </button>
      {result !== null && <p className="card">Seu tempo: <strong>{Math.round(result)} ms</strong></p>}
    </section>
  );
}
