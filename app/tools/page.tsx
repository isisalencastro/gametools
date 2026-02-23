import { CardGrid } from '@/components/CardGrid';
import { tools } from '@/lib/data';

export default function ToolsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold">Ferramentas</h1>
      <p className="text-slate-600">Calculadoras e utilitários para o dia a dia.</p>
      <CardGrid basePath="/tools" items={tools} />
    </section>
  );
}
