import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRentList } from "@/app/dashboard/data";
import { RentDialog } from "@/components/dashboard/RentDialog";
import { RentCard } from "@/components/dashboard/RentCard";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { Pagination } from "@/components/dashboard/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";

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

export default async function DashboardPage({ searchParams }: PageProps) {
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
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Мои объявления
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Создавайте, редактируйте и управляйте публичностью.
          </p>
        </div>
        <RentDialog
          trigger={<Button className="w-full sm:w-auto">+ Новое объявление</Button>}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2.5 sm:py-3">
        <SearchInput />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="У вас пока нет объявлений аренды недвижимости"
          description="Создайте первое объявление, чтобы оно появилось в списке."
        />
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-full">
          {items.map((item) => (
            <RentCard key={item.id} item={item} isOwner />
          ))}
          <Pagination page={page} pageCount={pageCount} query={query} />
        </div>
      )}
    </div>
  );
}
