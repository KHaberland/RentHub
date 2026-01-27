import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  query: string;
  sort?: string;
};

function buildHref(page: number, query: string, sort?: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query) {
    params.set("q", query);
  }
  if (sort) {
    params.set("sort", sort);
  }
  return `?${params.toString()}`;
}

export function Pagination({ page, pageCount, query, sort }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <Link
        href={buildHref(Math.max(1, page - 1), query, sort)}
        className={cn(
          "rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-95",
          page === 1 && "pointer-events-none opacity-50 cursor-not-allowed"
        )}
      >
        ← Назад
      </Link>
      <span className="px-2 font-medium">
        Страница {page} из {pageCount}
      </span>
      <Link
        href={buildHref(Math.min(pageCount, page + 1), query, sort)}
        className={cn(
          "rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-95",
          page === pageCount && "pointer-events-none opacity-50 cursor-not-allowed"
        )}
      >
        Вперёд →
      </Link>
    </div>
  );
}
