import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PromptCard } from "@/components/prompts/PromptCard";
import type { PropertyType } from "@/app/dashboard/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  const session = await auth();
  const limit = 12;

  const [recentRaw, popularRaw] = await Promise.all([
    prisma.rentHub.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        price: true,
        propertyType: true,
        area: true,
        rooms: true,
        city: true,
        district: true,
        images: true,
        createdAt: true,
        owner: { select: { name: true, email: true } },
        _count: { select: { likes: true } },
        likes: session?.user
          ? {
              where: { userId: session.user.id },
              select: { id: true }
            }
          : false
      }
    }),
    prisma.rentHub.findMany({
      where: { isPublic: true },
      orderBy: { likes: { _count: "desc" } },
      take: limit,
      select: {
        id: true,
        title: true,
        price: true,
        propertyType: true,
        area: true,
        rooms: true,
        city: true,
        district: true,
        images: true,
        createdAt: true,
        owner: { select: { name: true, email: true } },
        _count: { select: { likes: true } },
        likes: session?.user
          ? {
              where: { userId: session.user.id },
              select: { id: true }
            }
          : false
      }
    })
  ]);

  const mapItems = (
    items: Array<{
      id: string;
      title: string;
      price: any;
      propertyType: string;
      area: number;
      rooms: number | null;
      city: string;
      district: string | null;
      images: string[];
      createdAt: Date;
      owner: { name: string | null; email: string | null };
      _count: { likes: number };
      likes?: Array<{ id: string }>;
    }>
  ) =>
    items.map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      propertyType: item.propertyType as PropertyType,
      area: item.area,
      rooms: item.rooms,
      city: item.city,
      district: item.district,
      images: item.images,
      author: item.owner.name ?? item.owner.email?.split("@")[0] ?? "Автор",
      createdAt: item.createdAt,
      likesCount: item._count.likes,
      likedByMe: Boolean(item.likes && item.likes.length > 0)
    }));

  const recentPrompts = mapItems(recentRaw);
  const popularPrompts = mapItems(popularRaw);
  const canLike = Boolean(session?.user);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              Публичные объявления об аренде недвижимости
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Смотрите свежие и популярные объявления, доступные всем.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={session?.user ? "/dashboard" : "/login?from=/dashboard"}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/30 active:scale-95"
            >
              + Добавить объявление
            </Link>
            <Link
              href="/dashboard/public"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:shadow-sm active:scale-95"
            >
              Смотреть каталог
            </Link>
            {!session?.user ? (
              <span className="text-sm text-slate-500">
                Для добавления нужен вход.
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Новые</h2>
            <p className="text-sm text-slate-500">
              Самые свежие публичные объявления об аренде недвижимости.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Всего: {recentPrompts.length}</span>
            <Link
              href="/dashboard/public?sort=recent"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              Смотреть все
            </Link>
          </div>
        </div>
        {recentPrompts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
            Пока нет публичных объявлений об аренде недвижимости.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {recentPrompts.map((item) => (
              <li key={item.id}>
                <PromptCard {...item} canLike={canLike} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Популярные</h2>
            <p className="text-sm text-slate-500">
              Самые популярные объявления об аренде недвижимости по лайкам.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Всего: {popularPrompts.length}</span>
            <Link
              href="/dashboard/public?sort=popular"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              Смотреть все
            </Link>
          </div>
        </div>
        {popularPrompts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
            Пока нет популярных объявлений об аренде недвижимости.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {popularPrompts.map((item) => (
              <li key={item.id}>
                <PromptCard {...item} canLike={canLike} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
