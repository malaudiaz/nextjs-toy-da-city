// lib/sales.ts
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function createSale(toyIds: string[], buyerId: string) {

    const paymentMethod = "STRIPE" 

    if (!toyIds || !Array.isArray(toyIds) || toyIds.length === 0) {
        throw new Error("ToyIdsRequired");
    }

    // 1. Verificar que los juguetes existen y están disponibles para venta
    const allowedStatuses = await prisma.status.findMany({
        where: {
          name: { in: ["available", "reserved"] }
        },
        select: { id: true }
      });
    
    const statusIds = allowedStatuses.map(status => status.id);

    const toys = await prisma.toy.findMany({
        where: {
          id: { in: toyIds },
          forSell: true, // Solo juguetes marcados como "en venta"
          isActive: true, // Solo juguetes activos
          statusId: { in: statusIds } // Filtra por IDs de status
        },
        include: {status: true},
      });

    if (toys.length !== toyIds.length) {
        // const missingIds = toyIds.filter(id => !toys.some(toy => toy.id === id));
        throw new Error("SomeToysNotAvailable");
    }

    const soldStatus = await prisma.status.findUnique({
        where: { name: "sold" },
        select: { id: true }
      });
    if (!soldStatus) {
        throw new Error("StatusNotFound");
    }

    try {
        // 2. Crear transacciones y marcar juguetes como vendidos (en una transacción)
        const result = await prisma.$transaction(async (tx) => {
            
            // Crear transacciones (una por juguete)
            const transactions = await Promise.all(
                toys.map((toy) =>
                    tx.transaction.create({
                    data: {
                        toyId: toy.id,
                        buyerId: buyerId!,
                        sellerId: toy.sellerId, // Obtenido del juguete
                        price: toy.price,
                        statusId: toy.status.id, // Estado actual del juguete (o un ID fijo para "completado")
                        paymentMethod,
                        wasSold: true, // Marcamos como venta (no intercambio/regalo)
                        wasGifts: false,
                        wasChanged: false
                    },
                    })
                )
                );

            // Actualizar juguetes (marcar como no disponibles)
            await tx.toy.updateMany({
            where: { id: { in: toyIds } },
            data: { 
                forSell: false,
                isActive: false, // Opcional: desactivar el juguete después de la venta
                statusId: soldStatus.id // Cambiar estado a SOLD
            },
            });
    
            return true;
        });
    }
    catch (error) {
        console.error("Error en /api/toys/sales:", error);
    
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("DuplicateTransaction");
            }
        }
    
        throw new Error("SaleFailed");
    }
}
