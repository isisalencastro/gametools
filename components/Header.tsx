import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-blue-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold text-brand-blue">
          GameTools
        </Link>
        <nav className="flex gap-4 text-sm font-semibold">
          <Link href="/games" className="hover:text-brand-blue">
            Mini Jogos
          </Link>
          <Link href="/tools" className="hover:text-brand-blue">
            Ferramentas
          </Link>
        </nav>
      </div>
    </header>
  );
}
