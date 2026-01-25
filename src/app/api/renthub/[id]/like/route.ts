import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/renthub/[id]/like
 * Toggle лайка на публичном объявлении.
 * Возвращает: { liked: boolean, likesCount: number }
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // 1. Проверяем авторизацию
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходимо войти в систему" },
        { status: 401 }
      );
    }

    const { id: rentHubId } = await params;
    const userId = session.user.id;

    // 2. Проверяем, что объявление существует и публичное
    const rentHub = await prisma.rentHub.findUnique({
      where: { id: rentHubId },
      select: { id: true, isPublic: true }
    });

    if (!rentHub) {
      return NextResponse.json(
        { error: "Объявление не найдено" },
        { status: 404 }
      );
    }

    if (!rentHub.isPublic) {
      return NextResponse.json(
        { error: "Можно лайкать только публичные объявления" },
        { status: 403 }
      );
    }

    // 3. Toggle: проверяем, есть ли уже лайк
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_rentHubId: { userId, rentHubId }
      }
    });

    let liked: boolean;

    if (existingLike) {
      // Удаляем лайк
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      liked = false;
    } else {
      // Создаём лайк
      await prisma.like.create({
        data: { userId, rentHubId }
      });
      liked = true;
    }

    // 4. Считаем общее количество лайков
    const likesCount = await prisma.like.count({
      where: { rentHubId }
    });

    return NextResponse.json({ liked, likesCount });
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже." },
      { status: 500 }
    );
  }
}
