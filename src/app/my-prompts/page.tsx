import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRentList } from "@/app/dashboard/data";
import { RentCard } from "@/components/dashboard/RentCard";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";

type PageProps = {
  searchParams?:
    | {
        q?: string;
        page?: string;
      }
    | Promise<{
        q?: string;
        page?: string;
      }>;
};

function parsePage(value?: string) {
  const page = Number(value ?? 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function MyPromptsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const resolved = await Promise.resolve(searchParams);
  const query = resolved?.q ?? "";
  const page = parsePage(resolved?.page);

  const { items, pageCount } = await getRentList({
    scope: "mine",
    userId: session.user.id,
    query,
    page
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Мои объявления
        </h1>
        <p className="text-sm text-slate-500">
          Создавайте, редактируйте и управляйте публичностью.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <SearchInput placeholder="Поиск по моим объявлениям" />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="У вас пока нет объявлений аренды недвижимости"
          description="Создайте первое объявление, чтобы оно появилось в списке."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <RentCard key={item.id} item={item} isOwner />
          ))}
          <Pagination page={page} pageCount={pageCount} query={query} />
        </div>
      )}
    </div>
  );
}
