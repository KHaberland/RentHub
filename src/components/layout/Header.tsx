import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Logo } from "@/components/layout/Logo";

function getInitials(name?: string | null) {
  if (!name) return "RH";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const name = user?.name ?? user?.email?.split("@")[0] ?? "Гость";
  const initials = getInitials(name);
  const menuItems = [
    { href: "/", label: "Главная" },
    { href: "/dashboard/public", label: "Каталог" },
    {
      href: "/dashboard",
      label: "Мои объявления"
    }
  ];

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex flex-1 items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
          >
            <Logo size="md" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              RentHub
            </span>
          </Link>
        </div>

        <nav className="hidden flex-1 md:flex">
          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-800 text-sm font-semibold text-white min-h-[56px] px-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-6 py-2.5 text-white no-underline outline-none transition-all duration-200 hover:bg-primary-600/30 hover:text-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-100">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={name}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-600">
                      {initials}
                    </span>
                  )}
                </span>
                <span className="hidden text-sm font-medium text-slate-700 md:inline">
                  {name}
                </span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm active:scale-95"
                >
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login?from=/"
              className="rounded-full border-2 border-primary-600 bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-1.5 text-sm font-medium text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95"
            >
              Войти
            </Link>
          )}
        </div>
        </div>
      </div>
      <nav className="mx-auto flex w-full max-w-6xl justify-center px-6 pb-4 text-sm font-semibold text-white md:hidden">
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-700 to-primary-800 min-h-[56px] px-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2.5 text-white no-underline outline-none transition-all duration-200 hover:bg-primary-600/30 hover:text-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
