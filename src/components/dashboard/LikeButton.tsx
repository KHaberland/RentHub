"use client";

import { useState, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  rentHubId: string;
  initialLiked: boolean;
  initialCount: number;
  disabled?: boolean;
};

export function LikeButton({
  rentHubId,
  initialLiked,
  initialCount,
  disabled = false
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (disabled || isPending) return;

    // Оптимистичное обновление
    const prevLiked = liked;
    const prevCount = count;

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/renthub/${rentHubId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Ошибка");
        }

        const data = await res.json();
        setLiked(data.liked);
        setCount(data.likesCount);
      } catch (err) {
        // Откат при ошибке
        setLiked(prevLiked);
        setCount(prevCount);
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isPending}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95",
          liked
            ? "bg-primary-100 text-primary-700 hover:bg-primary-200 shadow-sm shadow-primary-500/10"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700",
          (disabled || isPending) && "cursor-not-allowed opacity-50"
        )}
        aria-label={liked ? "Убрать лайк" : "Поставить лайк"}
        aria-pressed={liked}
        title={error || undefined}
      >
        <ThumbsUp
          className={cn(
            "h-4 w-4 transition-transform",
            liked && "fill-current",
            isPending && "animate-pulse"
          )}
        />
        <span>{count}</span>
      </button>
    </div>
  );
}
