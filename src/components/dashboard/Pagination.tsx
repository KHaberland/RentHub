import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  query: string;
};

function buildHref(page: number, query: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query) {
    params.set("q", query);
  }
  return `?${params.toString()}`;
}

export function Pagination({ page, pageCount, query }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Link
        href={buildHref(Math.max(1, page - 1), query)}
        className={cn(
          "rounded-lg border border-slate-200 px-3 py-1",
          page === 1 && "pointer-events-none opacity-50"
        )}
      >
        Назад
      </Link>
      <span>
        Страница {page} из {pageCount}
      </span>
      <Link
        href={buildHref(Math.min(pageCount, page + 1), query)}
        className={cn(
          "rounded-lg border border-slate-200 px-3 py-1",
          page === pageCount && "pointer-events-none opacity-50"
        )}
      >
        Вперёд
      </Link>
    </div>
  );
}
