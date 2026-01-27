"use client";

import { useOptimistic, useTransition } from "react";
import {
  Star,
  Pencil,
  Trash2,
  Globe,
  Lock,
  MapPin,
  Home,
  Square,
  Users,
  Building
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
  canLike?: boolean;
};

export function RentCard({ item, isOwner, canLike = true }: RentCardProps) {
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

  const createdAtLabel = new Date(item.createdAt).toLocaleDateString("ru-RU");
  
  const propertyTypeLabels: Record<string, string> = {
    APARTMENT: "Квартира",
    HOUSE: "Дом",
    ROOM: "Комната",
    STUDIO: "Студия",
    COMMERCIAL: "Коммерческая"
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <div className="group flex flex-col gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 hover:border-primary-200 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-full">
        {/* Фотография */}
        {item.images && item.images.length > 0 ? (
          <div className="flex-shrink-0 w-full sm:w-auto max-w-full">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full sm:h-32 sm:w-32 h-48 sm:h-32 rounded-xl object-cover border border-slate-200 max-w-full"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 flex w-full sm:h-32 sm:w-32 h-48 sm:h-32 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 max-w-full">
            <Home className="h-8 w-8 text-slate-400" />
          </div>
        )}
        
        <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
              {item.title}
            </h3>
            <span className="rounded-full px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700">
              {propertyTypeLabels[item.propertyType] || item.propertyType}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold transition-all",
                optimistic.isPublic
                  ? "bg-accent-50 text-accent-700 border border-accent-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              )}
            >
              {optimistic.isPublic ? "Публичное" : "Приватное"}
            </span>
            {optimistic.isFavorite ? (
              <span className="rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-2 py-1 text-xs font-semibold text-amber-700">
                ⭐ Избранное
              </span>
            ) : null}
          </div>
          
          {/* Цена */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-primary-600">
              {formatPrice(item.price)} ₽
            </span>
            <span className="text-xs sm:text-sm text-slate-500">/мес</span>
          </div>
          
          {/* Характеристики */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {item.area > 0 && (
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{item.area} м²</span>
              </div>
            )}
            {item.rooms && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{item.rooms} {item.rooms === 1 ? 'комната' : item.rooms < 5 ? 'комнаты' : 'комнат'}</span>
              </div>
            )}
            {item.floor !== null && item.totalFloors !== null && (
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{item.floor}/{item.totalFloors} этаж</span>
              </div>
            )}
          </div>
          
          {/* Адрес */}
          <div className="mt-2 flex items-start gap-1 text-sm text-slate-600">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="break-words">
              {item.city}
              {item.district && `, ${item.district}`}
              {item.address && `, ${item.address}`}
            </span>
          </div>
          
          {/* Описание */}
          <div className="mt-2 line-clamp-2 text-sm text-slate-500">
            {item.content}
          </div>
          
          {/* Контакты (если разрешено показывать) */}
          {item.showContacts && (item.contactPhone || item.contactEmail) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
              {item.contactPhone && (
                <span>📞 {item.contactPhone}</span>
              )}
              {item.contactEmail && (
                <span>✉️ {item.contactEmail}</span>
              )}
            </div>
          )}
          
          <div className="mt-2 text-xs text-slate-500">
            Создано: {createdAtLabel}
          </div>
          
          {/* Лайки отображаются только для публичных объявлений */}
          {item.isPublic && (
            <div className="mt-3">
              {canLike ? (
                <LikeButton
                  rentHubId={item.id}
                  initialLiked={item.likedByMe}
                  initialCount={item.likesCount}
                />
              ) : (
                <span className="text-xs text-slate-500">
                  Лайков: {item.likesCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={cn(
              "rounded-full p-2 transition-all duration-200 hover:bg-amber-50 hover:scale-110 active:scale-95",
              optimistic.isFavorite 
                ? "text-amber-500 bg-amber-50" 
                : "text-slate-400 hover:text-amber-400",
              !isOwner && "pointer-events-none opacity-40"
            )}
            aria-label="Избранное"
            aria-pressed={optimistic.isFavorite}
          >
            <Star className={cn("h-4 w-4 transition-transform", optimistic.isFavorite && "fill-current")} />
          </button>

          {isOwner ? (
            <>
              <button
                type="button"
                onClick={handleTogglePublic}
                className={cn(
                  "rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95",
                  optimistic.isPublic
                    ? "text-accent-600 hover:bg-accent-50"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
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
                  price: item.price,
                  propertyType: item.propertyType,
                  area: item.area,
                  rooms: item.rooms,
                  floor: item.floor,
                  totalFloors: item.totalFloors,
                  city: item.city,
                  district: item.district,
                  address: item.address,
                  images: item.images,
                  contactPhone: item.contactPhone,
                  contactEmail: item.contactEmail,
                  showContacts: item.showContacts,
                  isPublic: item.isPublic
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
                className="hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
