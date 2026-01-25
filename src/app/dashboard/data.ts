import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { RentItem, SortOption } from "./types";

export const PAGE_SIZE = 10;

export type RentScope = "mine" | "public" | "favorites";

type GetRentListArgs = {
  scope: RentScope;
  userId: string;
  query: string;
  page: number;
  sort?: SortOption;
};

export async function getRentList({ scope, userId, query, page, sort = "recent" }: GetRentListArgs) {
  const where: Prisma.RentHubWhereInput =
    scope === "public"
      ? {
          isPublic: true,
          ...(query
            ? {
                OR: [
                  { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
                  { content: { contains: query, mode: Prisma.QueryMode.insensitive } }
                ]
              }
            : {})
        }
      : scope === "favorites"
      ? {
          userId,
          isFavorite: true,
          ...(query
            ? {
                OR: [
                  { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
                  { content: { contains: query, mode: Prisma.QueryMode.insensitive } }
                ]
              }
            : {})
        }
      : {
          userId,
          ...(query
            ? {
                OR: [
                  { title: { contains: query, mode: Prisma.QueryMode.insensitive } },
                  { content: { contains: query, mode: Prisma.QueryMode.insensitive } }
                ]
              }
            : {})
        };

  // Сортировка: по популярности или по дате
  const orderBy: Prisma.RentHubOrderByWithRelationInput =
    sort === "popular"
      ? { likes: { _count: "desc" } }
      : { createdAt: "desc" };

  const [rawItems, total] = await Promise.all([
    prisma.rentHub.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: {
          select: { likes: true }
        },
        likes: {
          where: { userId },
          select: { id: true }
        }
      }
    }),
    prisma.rentHub.count({ where })
  ]);

  // Преобразуем в формат RentItem с полями лайков
  const items: RentItem[] = rawItems.map((item) => ({
    id: item.id,
    userId: item.userId,
    title: item.title,
    content: item.content,
    isPublic: item.isPublic,
    isFavorite: item.isFavorite,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    likesCount: item._count.likes,
    likedByMe: item.likes.length > 0
  }));

  return {
    items,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE))
  };
}
