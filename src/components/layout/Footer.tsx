import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 text-sm text-slate-600 sm:flex-row sm:items-center">
        <span className="font-medium">© RentHub {year}</span>
        <div className="flex items-center gap-6">
          <Link 
            href="/policy" 
            className="transition-colors duration-200 hover:text-primary-600 font-medium"
          >
            Политика
          </Link>
          <Link 
            href="/contacts" 
            className="transition-colors duration-200 hover:text-primary-600 font-medium"
          >
            Контакты
          </Link>
        </div>
      </div>
    </footer>
  );
}
