"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  MessageSquare,
  Star,
  History,
  Settings,
  Bookmark,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  name: string;
  image?: string | null;
  email?: string | null;
};

const menuItems = [
  {
    label: "Объявления аренды недвижимости",
    href: "/dashboard",
    icon: MessageSquare
  },
  { label: "Избранное", href: "/dashboard/favorites", icon: Star },
  { label: "История", href: "/dashboard/history", icon: History },
  { label: "Настройки", href: "/dashboard/settings", icon: Settings },
  { label: "Публичные объявления", href: "/dashboard/public", icon: Bookmark }
];

export function MobileMenu({ name, image, email }: MobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Кнопка гамбургер-меню */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed top-20 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl md:hidden"
        aria-label="Открыть меню"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Выдвижное меню */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-[60] h-full w-[280px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Заголовок с информацией о пользователе */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-primary-600 to-primary-700 p-6">
            <div className="flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-md">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                    {initials || "RH"}
                  </span>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {name}
                </p>
                <p className="text-xs text-primary-100 truncate">
                  {email ?? "renthub.user"}
                </p>
              </div>
            </div>
          </div>

          {/* Навигация */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 no-underline transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700 font-semibold ring-2 ring-primary-200"
                        : "hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Разделитель */}
              <div className="my-2 h-px bg-slate-200" />

              {/* Кнопка выхода */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Выйти</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
