import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { RentItem, SortOption } from "./types";

export const PAGE_SIZE = 10;

export type RentScope = "mine" | "public" | "favorites";

type GetRentListArgs = {
  scope: RentScope;
  userId?: string;
  query: string;
  page: number;
  sort?: SortOption;
};

export async function getRentList({
  scope,
  userId,
  query,
  page,
  sort = "recent"
}: GetRentListArgs) {
  if (scope !== "public" && !userId) {
    throw new Error("userId is required for this scope");
  }
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
          userId: userId!,
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
          userId: userId!,
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
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        price: true,
        propertyType: true,
        area: true,
        rooms: true,
        floor: true,
        totalFloors: true,
        city: true,
        district: true,
        address: true,
        images: true,
        contactPhone: true,
        contactEmail: true,
        showContacts: true,
        isPublic: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { likes: true }
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true }
            }
          : false
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
    price: Number(item.price),
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
    isPublic: item.isPublic,
    isFavorite: item.isFavorite,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    likesCount: item._count.likes,
    likedByMe: userId ? item.likes.length > 0 : false
  }));

  return {
    items,
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE))
  };
}
