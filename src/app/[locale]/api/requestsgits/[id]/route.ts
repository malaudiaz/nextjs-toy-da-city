// app/api/requestsgits/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";

// confirma la solicitud indicada y el resto la rechaza
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const g = await getTranslations("General");
  const t = await getTranslations("Toy");

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
  }

  const { id: requestId } = await params;

  try {
    // Validar que la solicitud existe y obtener información completa
    const giftRequest = await prisma.giftRequest.findUnique({
      where: { id: requestId },
      include: {
        toy: {
          include: {
            status: true,
          },
        },
        status: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!giftRequest) {
      return NextResponse.json({ error: g("GiftRequestNotFound") }, { status: 404 });
    }

    // Validaciones de negocio
    if (giftRequest.toy.sellerId !== userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 404 });
    }

    if (!giftRequest.toy.forGifts) {
      return NextResponse.json({ error: t("GiftRequestNotGift") }, { status: 404 });
    }

    if (giftRequest.status.name === "cancelled" || giftRequest.status.name === "reserved") {
      return NextResponse.json({ error: t("StatusIncorrect") }, { status: 404 });
    }

    // Buscar estados necesarios
    const statuses = await prisma.status.findMany({
      where: {
        name: {
          in: ["confirmed", "rejected", "sold"],
        },
      },
    });

    const confirmedStatus = statuses.find(s => s.name === "confirmed");
    const rejectedStatus = statuses.find(s => s.name === "rejected");
    const soldStatus = statuses.find(s => s.name === "sold");
    
    if (!confirmedStatus || !rejectedStatus || !soldStatus ) {
      return NextResponse.json({ error: g("ServerError") }, { status: 404 });
    }

    // Ejecutar transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Confirmar la solicitud seleccionada
      const updatedRequest = await tx.giftRequest.update({
        where: { id: requestId },
        data: { statusId: confirmedStatus.id },
        include: {
          status: true,
        },
      });

      // 2. Cancelar otras solicitudes activas para el mismo juguete
      const cancelledResult = await tx.giftRequest.updateMany({
        where: {
          toyId: giftRequest.toyId,
          id: { not: requestId },
          status: {
            name: {
              in: ["available"],
            },
          },
        },
        data: { statusId: rejectedStatus.id },
      });

      // 3. Marcar el juguete como completado/asignado
      await tx.toy.update({
        where: { id: giftRequest.toyId },
        data: {
          statusId: soldStatus.id,
          forGifts: true,
          forChanges: false,
          updatedAt: new Date(),
        },
      });

      return {
        confirmedRequest: updatedRequest,
        cancelledCount: cancelledResult.count,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        confirmedRequest: {
          id: result.confirmedRequest.id,
          status: result.confirmedRequest.status.name,
          cancelledOtherRequests: result.cancelledCount,
        },
        message: g('OperationOk'),
      },
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
