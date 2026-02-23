import Link from 'next/link';

type Item = {
  slug: string;
  title: string;
  description: string;
};

export function CardGrid({ basePath, items }: { basePath: string; items: Item[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.slug} className="card">
          <h3 className="text-lg font-bold text-brand-dark">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          <Link href={`${basePath}/${item.slug}`} className="btn-primary mt-4">
            Abrir
          </Link>
        </article>
      ))}
    </div>
  );
}
