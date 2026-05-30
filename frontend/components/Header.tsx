import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold text-blue-600 tracking-tight hover:text-blue-500 transition-colors">
        Portfolio
      </Link>
      <nav className="flex gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link href="/contact" className="hover:text-blue-600 transition-colors">
          Contact
        </Link>
      </nav>
    </header>
  );
}
