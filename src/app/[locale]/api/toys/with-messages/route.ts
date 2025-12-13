import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getUserImageUrl } from "@/lib/actions/getUserActions";
import { getTranslations } from "next-intl/server";
import { PaginationSchema} from "@/lib/schemas/toy";


export async function GET(req: NextRequest) {
  // --- 1. Autenticación ---
  let { userId: clerkUserId } = await auth();
  const g = await getTranslations("General");
  

  if (!clerkUserId) {
    clerkUserId = req.headers.get("X-User-ID");
    if (!clerkUserId) {
      return NextResponse.json({ error: g("Unauthorized") }, { status: 401 });
    }
  }

  // --- 2. Verificar que el usuario existe en tu base ---
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: g("UserNotFound") }, { status: 404 });
  }

  const { searchParams } = new URL(req.url!)
  const pagination = PaginationSchema.parse({
        page: parseInt(searchParams.get('page') || "1"),
        limit: parseInt(searchParams.get('limit') || "4")
      });

  const whereCondition = {
    sellerId: user.id,
    isActive: true,
    Message: {
      some: {
        senderId: {
          not: clerkUserId, // ← EXCLUYE mensajes enviados por el propio vendedor (usuario logueado)
        },
      },
    },
  };

  try {
    // 1. Obtener juguetes del vendedor con mensajes de otros usuarios (no él mismo)
    // const toysWithMessages = await prisma.toy.findMany({
    //   where: whereCondition,
    //   include: {
    //     media: true,
    //     Message: {
    //       where: {
    //         senderId: {
    //           not: clerkUserId, // ← También filtramos aquí para optimizar
    //         },
    //       },
    //       include: {
    //         sender: {
    //           select: {
    //             id: true,
    //             name: true,
    //             email: true,
    //           },
    //         },
    //       },
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //       take: 1, // Opcional: si solo quieres un mensaje por toy (el más reciente), útil para rendimiento
    //     },
    //   },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // });

    const query = {
      where: whereCondition,
      include: {
        media: true,
        Message: {
          where: {
            senderId: {
              not: clerkUserId, // ← También filtramos aquí para optimizar
            },
          },
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
            createdAt: "desc" as const, // El "as const" ayuda con la inferencia de tipos
          },
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit
        },
      },
    };

    // Ejecutar consulta
    const [toysWithMessages, totalCount] = await Promise.all([
      prisma.toy.findMany(query),
      prisma.toy.count({ where: whereCondition })
    ])

    // 2. Transformar: crear lista de remitentes únicos (solo quienes NO son el vendedor)
    const toysWithoutMessageField = toysWithMessages.map((toy) => {
      // Extraemos remitentes únicos (por ID), excluyendo al vendedor
      const uniqueSenders = Array.from(
        new Map(
          toy.Message.map((msg) => [
            msg.sender.id,
            {
              id: msg.sender.id,
              clerkId: msg.senderId,
              imageUrl: getUserImageUrl(msg.senderId),
              fullName: msg.sender.name,
              email: msg.sender.email,
            },
          ])
        ).values()
      );

      // Eliminamos el campo Message
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Message, ...toyWithoutMessage } = toy;

      return {
        ...toyWithoutMessage,
        messageSenders: uniqueSenders,
      };
    });

    return NextResponse.json({
      success: true,
      data: toysWithoutMessageField, 
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pagination.limit),
        currentPage: pagination.page,
        perPage: pagination.limit
      }
    })

    // return NextResponse.json(toysWithoutMessageField);
  } catch (error) {
    console.error("Error al obtener juguetes con remitentes únicos:", error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}