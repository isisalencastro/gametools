import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-brand-dark p-8 text-white">
        <span className="inline-block rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold text-brand-dark">
          v1.0 lançada
        </span>
        <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">Mini jogos e ferramentas em um só lugar</h1>
        <p className="mt-4 max-w-2xl text-blue-100">
          Jogue, calcule e resolva tarefas do dia a dia com uma interface rápida, bonita e mobile-first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/games" className="btn-primary">
            Explorar jogos
          </Link>
          <Link href="/tools" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-dark">
            Explorar ferramentas
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-2xl font-bold">Para diversão</h2>
          <p className="mt-2 text-slate-600">Jogos curtos para passar o tempo e desafiar reflexos e lógica.</p>
          <Link href="/games" className="btn-primary mt-4">
            Ver mini jogos
          </Link>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold">Para utilidade</h2>
          <p className="mt-2 text-slate-600">Calculadoras práticas para saúde, estudos e rotina.</p>
          <Link href="/tools" className="btn-primary mt-4">
            Ver ferramentas
          </Link>
        </div>
      </div>
    </section>
  );
}
