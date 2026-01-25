import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRentList } from "@/app/dashboard/data";
import { RentCard } from "@/components/dashboard/RentCard";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { SortSelect } from "@/components/dashboard/SortSelect";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import type { SortOption } from "@/app/dashboard/types";

type PageProps = {
  searchParams?:
    | {
        q?: string;
        page?: string;
        sort?: string;
      }
    | Promise<{
        q?: string;
        page?: string;
        sort?: string;
      }>;
};

function parsePage(value?: string) {
  const page = Number(value ?? 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseSort(value?: string): SortOption {
  return value === "popular" ? "popular" : "recent";
}

export default async function PublicDashboardPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const resolved = await Promise.resolve(searchParams);
  const query = resolved?.q ?? "";
  const page = parsePage(resolved?.page);
  const sort = parseSort(resolved?.sort);

  const { items, pageCount } = await getRentList({
    scope: "public",
    userId: session.user.id,
    query,
    page,
    sort
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Публичные объявления
        </h1>
        <p className="text-sm text-slate-500">
          Просматривайте доступные всем объявления.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Поиск по публичным объявлениям" />
        <SortSelect currentSort={sort} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Публичных объявлений пока нет"
          description="Как только пользователи сделают объявление публичным, оно появится здесь."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <RentCard
              key={item.id}
              item={item}
              isOwner={item.userId === session.user.id}
            />
          ))}
          <Pagination page={page} pageCount={pageCount} query={query} />
        </div>
      )}
    </div>
  );
}
