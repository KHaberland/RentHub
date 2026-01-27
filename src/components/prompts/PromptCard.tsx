import Link from "next/link";
import { LikeButton } from "@/components/dashboard/LikeButton";
import { Home, MapPin, Square, Users } from "lucide-react";
import type { PropertyType } from "@/app/dashboard/types";

type PromptCardProps = {
  id: string;
  title: string;
  price?: number;
  propertyType?: PropertyType;
  area?: number;
  rooms?: number | null;
  city?: string;
  district?: string | null;
  images?: string[];
  author: string;
  createdAt: Date;
  likesCount: number;
  likedByMe: boolean;
  canLike: boolean;
};

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

export function PromptCard({
  id,
  title,
  price,
  propertyType,
  area,
  rooms,
  city,
  district,
  images,
  author,
  createdAt,
  likesCount,
  likedByMe,
  canLike
}: PromptCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1 hover:border-primary-200">
      {/* Фотография */}
      {images && images.length > 0 ? (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <Home className="h-12 w-12 text-slate-400" />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 line-clamp-1">{title}</h3>
          {propertyType && (
            <span className="flex-shrink-0 rounded-full px-2 py-1 text-xs font-semibold bg-primary-100 text-primary-700">
              {propertyTypeLabels[propertyType] || propertyType}
            </span>
          )}
        </div>
        
        {/* Цена */}
        {price !== undefined && (
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-slate-500">₽/мес</span>
          </div>
        )}
        
        {/* Характеристики */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          {area !== undefined && area > 0 && (
            <div className="flex items-center gap-1">
              <Square className="h-3 w-3" />
              <span>{area} м²</span>
            </div>
          )}
          {rooms !== undefined && rooms !== null && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{rooms} {rooms === 1 ? 'комн.' : rooms < 5 ? 'комн.' : 'комн.'}</span>
            </div>
          )}
          {(city || district) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{city}{district && `, ${district}`}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{author}</span>
            <span>·</span>
            <span>{createdAt.toLocaleDateString("ru-RU")}</span>
          </div>
          {likesCount > 0 && (
            <div className="text-xs text-slate-500">❤️ {likesCount}</div>
          )}
        </div>
        
        {(likesCount > 0 || likedByMe || canLike) && (
          <div className="mt-3">
            <LikeButton
              rentHubId={id}
              initialLiked={likedByMe}
              initialCount={likesCount}
              disabled={!canLike}
            />
          </div>
        )}
      </div>
    </div>
  );
}
