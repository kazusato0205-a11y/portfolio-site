import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-8 py-4 backdrop-blur-md">
      <Link href="/" className="text-xl font-bold tracking-tight text-blue-600 transition-colors hover:text-blue-500">
        Portfolio
      </Link>
      <nav className="flex gap-8 text-sm font-medium text-slate-600">
        <Link href="/" className="transition-colors hover:text-blue-600">
          Home
        </Link>
        <Link href="/contact" className="transition-colors hover:text-blue-600">
          Contact
        </Link>
      </nav>
    </header>
  );
}
