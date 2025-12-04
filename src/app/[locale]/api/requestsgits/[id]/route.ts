// app/api/requestsgits/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/nodemailer";

// confirma la solicitud indicada y el resto la rechaza
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const g = await getTranslations("General");
  const t = await getTranslations("Toy");
  const s = await getTranslations("sendMail");

  let { userId } = await auth();

  // let userId = "user_35cncVrYiQ8dVsoTrY512Q2BXlW"

  if (!userId) {
    userId = request.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
  }

  const { id: id } = await params;

  try {
    // Validar que la solicitud existe y obtener información completa
    const giftRequest = await prisma.giftRequest.findUnique({
      where: { id: id },
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
      return NextResponse.json(
        { error: g("GiftRequestNotFound") },
        { status: 404 }
      );
    }

    // Validaciones de negocio
    if (giftRequest.toy.sellerId !== user.id) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 404 });
    }

    if (
      giftRequest.status.name === "cancelled" ||
      giftRequest.status.name === "reserved"
    ) {
      return NextResponse.json(
        { error: t("StatusIncorrect") },
        { status: 404 }
      );
    }

    // Buscar estados necesarios
    const statuses = await prisma.status.findMany({
      where: {
        name: {
          in: ["confirmed", "rejected", "sold"],
        },
      },
    });

    const confirmedStatus = statuses.find((s) => s.name === "confirmed");
    const rejectedStatus = statuses.find((s) => s.name === "rejected");
    const soldStatus = statuses.find((s) => s.name === "sold");

    if (!confirmedStatus || !rejectedStatus || !soldStatus) {
      return NextResponse.json({ error: g("ServerError") }, { status: 404 });
    }

    // Ejecutar transacción
    await prisma.$transaction(async (tx) => {
      // 1. Confirmar la solicitud seleccionada
      await tx.giftRequest.update({
        where: { id: id },
        data: { statusId: confirmedStatus.id },
        include: {
          status: true,
        },
      });

      // 2. Cancelar otras solicitudes activas para el mismo juguete
      await tx.giftRequest.updateMany({
        where: {
          toyId: giftRequest.toyId,
          id: { not: id },
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

      // Buscar el usuario que hizo la solicitud
      const userRequest = await tx.user.findUnique({
        where: { id: giftRequest.userId },
        select: { email: true, name: true },
      });

      if (userRequest?.email) {
        await sendEmail({
          to: userRequest.email,
          subject: g("GiftSubject"),
          html: `
           <div style="max-width:480px;margin:auto;background:#f8f8f8;border-radius:12px;padding:32px 24px;font-family:sans-serif;color:#222;box-shadow:0 2px 8px #0001;">
             <h2 style="color:#4c754b;margin-bottom:8px;">${g("giftRequestApprovedTitle")}</h2>
             <p style="font-size:1.1em;margin-bottom:16px;">${g("giftGreeting")} <strong>${userRequest.name}</strong>,</p>
             <p style="margin-bottom:18px;">${g("giftRequestApprovedMessage")}</p>
             <h3 style="margin-bottom:8px;color:#4c754b;">${g("approvedGift")}</h3>
             <div style="margin-bottom:18px;">
               <p style="margin-bottom:4px;"><strong>${giftRequest.toy.title}</strong></p>
             </div>
             <a href="mailto:soporte@toydacity.com" style="display:inline-block;background:#4c754b;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:500;margin-bottom:18px;">${s("contactSupport") ?? "Contactar soporte"}</a>
             <p style="margin-top:24px;font-size:1.05em;">${s("farewell")}</p>
         </div>
         `,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}
