// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId: reviewerId } = await auth();

    if (!reviewerId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: reviewerId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { targetUserId, rating, comment, orderId } = body;

    // Validaciones básicas
    if (!targetUserId || !rating) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: targetUserId, rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "La calificación debe ser un entero entre 1 y 5" },
        { status: 400 }
      );
    }

    // Verificar que el reviewer y target son usuarios distintos
    if (user?.id === targetUserId) {
      return NextResponse.json(
        { error: "No puedes reseñarte a ti mismo" },
        { status: 400 }
      );
    }

    // Verificar que el reviewer haya comprado algo al target
    const hasPurchased = await prisma.order.findFirst({
      where: {
        buyerId: user?.id,
        sellerId: targetUserId,
        status: "TRANSFERRED",
        ...(orderId ? { id: orderId } : {}),
      },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        {
          error:
            "Solo puedes reseñar a vendedores con los que hayas realizado una compra confirmada.",
        },
        { status: 403 }
      );
    }

    // Verificar que no haya dejado ya una reseña para esta orden (si se especifica orderId)
    if (orderId) {
      const existingReview = await prisma.review.findUnique({
        where: {
          reviewerId_targetId_orderId: {
            reviewerId: user?.id,
            targetId: targetUserId,
            orderId,
          },
        },
      });

      if (existingReview) {
        return NextResponse.json(
          { error: "Ya has dejado una reseña por esta orden." },
          { status: 409 }
        );
      }
    }

    // Crear la reseña
    const review = await prisma.review.create({
      data: {
        reviewerId: user?.id,
        targetId: targetUserId,
        rating,
        comment: comment || null,
        orderId: orderId || null,
      },
      include: {
        reviewer: true,
        target: true,
      },
    });

    // ✅ ACTUALIZAR EL ESTADO DE LA ORDEN si se proporcionó orderId
    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "TRANSFERRED" }, // O el estado que quieras usar
        });
      } catch (error) {
        console.error("Error updating order status:", error);
        // No fallar la creación de la reseña si falla la actualización del estado
      }
    }

    // Recalcular reputación del vendedor (target)
    const reviews = await prisma.review.findMany({
      where: { targetId: targetUserId },
    });

    const validRatings = reviews
      .map((r) => r.rating)
      .filter(
        (rating): rating is number =>
          typeof rating === "number" && !isNaN(rating)
      );

    const newReputation =
      validRatings.length > 0
        ? parseFloat(
            (
              validRatings.reduce((sum, rating) => sum + rating, 0) /
              validRatings.length
            ).toFixed(2)
          )
        : 0;

    await prisma.user.update({
      where: { id: targetUserId },
      data: { reputation: newReputation },
    });

    return NextResponse.json(
      { message: "Reseña creada con éxito", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}