import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"; // Asegúrate de tener esto definido
import { getUserImageUrl } from "@/lib/actions/getUserActions";

export async function GET(req: NextRequest) {
  // --- 1. Autenticación ---
  let { userId } = await auth();

  if (!userId) {
    userId = req.headers.get("X-User-ID");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // --- 2. Verificar que el usuario existe en tu base ---
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    // 1. Obtener solo los juguetes del vendedor que tienen al menos un mensaje
    const toysWithMessages = await prisma.toy.findMany({
      where: {
        sellerId: user.id,
        isActive: true,
        Message: {
          some: {}, // ← ¡ESTO ES CLAVE! Solo juguetes con al menos 1 mensaje
        },
      },
      include: {
        media: true,
        Message: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Opcional: ordenar mensajes más recientes primero
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2. Transformar: eliminar "Message" y generar "messageSenders" únicos
    const toysWithoutMessageField = toysWithMessages.map((toy) => {
      // Crear lista única de remitentes usando Map para evitar duplicados
      const uniqueSenders = Array.from(
        new Map(
          toy.Message.map((msg) => [
            msg.sender.id, // clave única por ID de usuario
            {
              id: msg.sender.id,
              clerkId: msg.senderId,
              imageUrl: getUserImageUrl(msg.senderId), // Función para obtener la URL de la imagen
              fullName: msg.sender.name,
              email: msg.sender.email,
            },
          ])
        ).values()
      );

      // 👇 ¡Eliminamos explícitamente el campo "Message"!
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Message, ...toyWithoutMessage } = toy;

      return {
        ...toyWithoutMessage,
        messageSenders: uniqueSenders,
      };
    });

    return NextResponse.json(toysWithoutMessageField);
  } catch (error) {
    console.error("Error al obtener juguetes con remitentes únicos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
