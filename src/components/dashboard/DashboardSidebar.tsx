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
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
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

export function DashboardSidebar({ name, image, email }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <aside className="w-[280px] shrink-0 bg-slate-100 px-6 py-8">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2 text-left shadow-soft transition-colors hover:bg-white"
      >
        <span className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-soft">
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
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              {name}
            </span>
            <span className="block text-xs text-slate-500">
              {email ?? "renthub.user"}
            </span>
          </span>
        </span>
        <span
          className={cn(
            "text-xs font-medium text-slate-500 transition-transform",
            isOpen && "rotate-180"
          )}
        >
          ▼
        </span>
      </button>

      <nav
        className={cn(
          "mt-2 overflow-hidden rounded-2xl bg-white/70 px-2 py-3 shadow-soft transition-all",
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 no-underline transition-colors",
                  isActive
                    ? "bg-white text-slate-900 shadow-soft ring-1 ring-slate-200/60"
                    : "hover:bg-white hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Разделитель */}
          <div className="my-1 h-px bg-slate-200" />

          {/* Кнопка выхода */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Выйти</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
