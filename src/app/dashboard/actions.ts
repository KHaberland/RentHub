"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const RentSchema = z.object({
  title: z.string().min(2, "Введите заголовок").max(120),
  content: z.string().min(10, "Слишком короткий текст").max(2000),
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
