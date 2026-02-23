import { CardGrid } from '@/components/CardGrid';
import { games } from '@/lib/data';

export default function GamesPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold">Mini Jogos</h1>
      <p className="text-slate-600">Jogos rápidos com foco em diversão e desempenho.</p>
      <CardGrid basePath="/games" items={games} />
    </section>
  );
}
