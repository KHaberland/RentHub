"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/app/dashboard/types";

type SortSelectProps = {
  currentSort: SortOption;
};

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page"); // Сбрасываем страницу при смене сортировки
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Сортировка:</span>
      <div className="flex rounded-lg border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => handleSort("recent")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            currentSort === "recent"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Clock className="h-4 w-4" />
          Новые
        </button>
        <button
          type="button"
          onClick={() => handleSort("popular")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            currentSort === "popular"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          Популярные
        </button>
      </div>
    </div>
  );
}
