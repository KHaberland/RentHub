"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const RentSchema = z.object({
  title: z.string().min(2, "Введите заголовок").max(120),
  content: z.string().min(10, "Слишком короткий текст").max(2000),
  price: z.number().min(1, "Цена должна быть не менее 1 рубля").max(10000000, "Слишком большая цена"),
  propertyType: z.enum(["APARTMENT", "HOUSE", "ROOM", "STUDIO", "COMMERCIAL"]),
  area: z.number().positive("Площадь должна быть положительной").max(10000, "Слишком большая площадь"),
  rooms: z.number().int().positive().max(20).nullable(),
  floor: z.number().int().min(0).max(200).nullable(),
  totalFloors: z.number().int().positive("Количество этажей должно быть положительным").max(200).nullable(),
  city: z.string().min(1, "Укажите город").max(100),
  district: z.string().max(100).nullable(),
  address: z.string().min(1, "Укажите адрес").max(200),
  images: z.array(z.string()).max(10, "Максимум 10 фотографий"),
  contactPhone: z.string().regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, "Некорректный формат телефона").nullable(),
  contactEmail: z.string().email("Некорректный email").nullable(),
  showContacts: z.boolean(),
  isPublic: z.boolean()
});

const UpdateSchema = RentSchema.extend({
  id: z.string().min(1)
});

const ToggleSchema = z.object({
  id: z.string().min(1),
  value: z.boolean()
});

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/public");
  revalidatePath("/dashboard/favorites");
}

export async function createRentHub(data: z.infer<typeof RentSchema>) {
  const userId = await requireUserId();
  const payload = RentSchema.parse(data);

  await prisma.rentHub.create({
    data: {
      userId,
      title: payload.title,
      content: payload.content,
      price: payload.price,
      propertyType: payload.propertyType,
      area: payload.area,
      rooms: payload.rooms,
      floor: payload.floor,
      totalFloors: payload.totalFloors,
      city: payload.city,
      district: payload.district,
      address: payload.address,
      images: payload.images,
      contactPhone: payload.contactPhone,
      contactEmail: payload.contactEmail,
      showContacts: payload.showContacts,
      isPublic: payload.isPublic
    }
  });

  revalidateDashboard();
}

export async function updateRentHub(data: z.infer<typeof UpdateSchema>) {
  const userId = await requireUserId();
  const payload = UpdateSchema.parse(data);

  const item = await prisma.rentHub.findUnique({
    where: { id: payload.id }
  });

  // Проверка прав: редактировать может только владелец.
  if (!item || item.userId !== userId) {
    throw new Error("Not allowed");
  }

  await prisma.rentHub.update({
    where: { id: payload.id },
    data: {
      title: payload.title,
      content: payload.content,
      price: payload.price,
      propertyType: payload.propertyType,
      area: payload.area,
      rooms: payload.rooms,
      floor: payload.floor,
      totalFloors: payload.totalFloors,
      city: payload.city,
      district: payload.district,
      address: payload.address,
      images: payload.images,
      contactPhone: payload.contactPhone,
      contactEmail: payload.contactEmail,
      showContacts: payload.showContacts,
      isPublic: payload.isPublic
    }
  });

  revalidateDashboard();
}

export async function deleteRentHub(id: string) {
  const userId = await requireUserId();

  const item = await prisma.rentHub.findUnique({ where: { id } });
  // Проверка прав: удалять может только владелец.
  if (!item || item.userId !== userId) {
    throw new Error("Not allowed");
  }

  await prisma.rentHub.delete({ where: { id } });

  revalidateDashboard();
}

export async function togglePublic(input: z.infer<typeof ToggleSchema>) {
  const userId = await requireUserId();
  const payload = ToggleSchema.parse(input);

  const item = await prisma.rentHub.findUnique({ where: { id: payload.id } });
  // Проверка прав: менять публичность может только владелец.
  if (!item || item.userId !== userId) {
    throw new Error("Not allowed");
  }

  await prisma.rentHub.update({
    where: { id: payload.id },
    data: { isPublic: payload.value }
  });

  revalidateDashboard();
}

export async function toggleFavorite(input: z.infer<typeof ToggleSchema>) {
  const userId = await requireUserId();
  const payload = ToggleSchema.parse(input);

  const item = await prisma.rentHub.findUnique({ where: { id: payload.id } });
  // Проверка прав: избранное доступно только владельцу записи.
  if (!item || item.userId !== userId) {
    throw new Error("Not allowed");
  }

  await prisma.rentHub.update({
    where: { id: payload.id },
    data: { isFavorite: payload.value }
  });

  revalidateDashboard();
}
