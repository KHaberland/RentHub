"use client";

import { useOptimistic, useTransition } from "react";
import {
  MessageSquare,
  Star,
  Pencil,
  Trash2,
  Globe,
  Lock
} from "lucide-react";
import { RentDialog } from "@/components/dashboard/RentDialog";
import { LikeButton } from "@/components/dashboard/LikeButton";
import { Button } from "@/components/ui/button";
import { toggleFavorite, togglePublic, deleteRentHub } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { RentItem } from "@/app/dashboard/types";

type RentCardProps = {
  item: RentItem;
  isOwner: boolean;
};

export function RentCard({ item, isOwner }: RentCardProps) {
  const [optimistic, updateOptimistic] = useOptimistic(
    { isPublic: item.isPublic, isFavorite: item.isFavorite },
    (state, next: { key: "isPublic" | "isFavorite"; value: boolean }) => ({
      ...state,
      [next.key]: next.value
    })
  );
  const [isPending, startTransition] = useTransition();

  const handleTogglePublic = () => {
    if (!isOwner) return;
    const nextValue = !optimistic.isPublic;
    startTransition(async () => {
      updateOptimistic({ key: "isPublic", value: nextValue });
      try {
        await togglePublic({ id: item.id, value: nextValue });
      } catch (error) {
        console.error(error);
        // Roll back optimistic update on failure.
        updateOptimistic({ key: "isPublic", value: !nextValue });
      }
    });
  };

  const handleToggleFavorite = () => {
    if (!isOwner) return;
    const nextValue = !optimistic.isFavorite;
    startTransition(async () => {
      updateOptimistic({ key: "isFavorite", value: nextValue });
      try {
        await toggleFavorite({ id: item.id, value: nextValue });
      } catch (error) {
        console.error(error);
        // Roll back optimistic update on failure.
        updateOptimistic({ key: "isFavorite", value: !nextValue });
      }
    });
  };

  const handleDelete = () => {
    if (!isOwner) return;
    if (!window.confirm("Удалить объявление?")) return;
    startTransition(async () => {
      await deleteRentHub(item.id);
    });
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {item.title}
          </div>
          <div className="mt-1 line-clamp-2 text-sm text-slate-500">
            {item.content}
          </div>
          {/* Лайки отображаются только для публичных объявлений */}
          {item.isPublic && (
            <div className="mt-2">
              <LikeButton
                rentHubId={item.id}
                initialLiked={item.likedByMe}
                initialCount={item.likesCount}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={cn(
            "rounded-full p-2 transition-colors",
            optimistic.isFavorite ? "text-yellow-500" : "text-slate-400",
            !isOwner && "pointer-events-none opacity-40"
          )}
          aria-label="Избранное"
          aria-pressed={optimistic.isFavorite}
        >
          <Star className="h-4 w-4" />
        </button>

        {isOwner ? (
          <>
            <button
              type="button"
              onClick={handleTogglePublic}
              className="rounded-full p-2 text-slate-400 transition-colors hover:text-slate-600"
              aria-label="Публичность"
              aria-pressed={optimistic.isPublic}
            >
              {optimistic.isPublic ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>

            <RentDialog
              initial={{
                id: item.id,
                title: item.title,
                content: item.content,
                isPublic: optimistic.isPublic
              }}
              trigger={
                <Button variant="outline" size="icon" type="button">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />

            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
