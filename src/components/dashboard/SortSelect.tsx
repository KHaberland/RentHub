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
      <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-sm">
        <button
          type="button"
          onClick={() => handleSort("recent")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95",
            currentSort === "recent"
              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-500/25"
              : "text-slate-600 hover:bg-white hover:text-slate-900"
          )}
        >
          <Clock className="h-4 w-4" />
          Новые
        </button>
        <button
          type="button"
          onClick={() => handleSort("popular")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95",
            currentSort === "popular"
              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-500/25"
              : "text-slate-600 hover:bg-white hover:text-slate-900"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          Популярные
        </button>
      </div>
    </div>
  );
}
