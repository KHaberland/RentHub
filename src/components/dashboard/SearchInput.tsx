"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  placeholder?: string;
};

export function SearchInput({ placeholder }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }, 400);

    return () => clearTimeout(handle);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary-500" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder ?? "Поиск по заголовку или тексту"}
        className="pl-9 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus-visible:border-primary-300 focus-visible:ring-primary-200 focus-visible:bg-white hover:border-slate-300"
      />
    </div>
  );
}
