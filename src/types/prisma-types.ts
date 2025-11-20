import { Prisma } from "@prisma/client";

// --- 1. Tipos Auxiliares 'Select' ---
export type Negotiator = {
    id: string;
    name: string;
    email: string | null;
}

// 1b. DTO de Vendedor/Negociador con Elegibilidad (EL TIPO CLAVE)
export type NegotiatorWithReviewEligibility = Negotiator & {
    isEligibleForReview: boolean;
};

// --- 2. Definición del 'include' (se mantiene igual) ---
export const orderWithAllRelations = Prisma.validator<Prisma.OrderInclude>()({
    items: {
        include: {
            toy: {
                include: {
                    media: true, 
                    seller: { // Solo selecciona id, name, email (base Negotiator)
                        select: { id: true, name: true, email: true },
                    },
                },
            },
        }
    },
    buyer: {
        select: { id: true, name: true, email: true },
    },
});

// --- 3. Generación del Tipo Principal de Prisma (se mantiene igual) ---
type OrderWithPrismaRelations = Prisma.OrderGetPayload<{
    include: typeof orderWithAllRelations;
}>;


// Definimos los tipos intermedios para mayor claridad
type ItemWithPrismaRelations = OrderWithPrismaRelations['items'][number];
type ToyWithPrismaRelations = ItemWithPrismaRelations['toy'];


// --- 4. Tipo DTO para el Cliente (CORRECCIÓN FINAL) ---
export type ClientOrderWithItems = Omit<
    OrderWithPrismaRelations, 
    // Omitimos todas las fechas y relaciones complejas
    | 'createdAt' 
    | 'updatedAt' 
    | 'confirmedAt' 
    | 'canceledAt' 
    | 'transferredAt' 
    | 'reembursedAt'
    | 'buyer'
    | 'seller'
    | 'items' // <- Omitimos 'items' para definirlo completamente a continuación
> & {
    // Re-tipado de Fechas
    createdAt: string;
    updatedAt: string;
    confirmedAt: string | null;
    canceledAt: string | null;
    transferredAt: string | null;
    reembursedAt: string | null;
    
    // Re-tipado de relaciones principales
    buyer: Negotiator;
    seller: Negotiator;

    // ✅ Re-tipado COMPLETO de la estructura anidada ITEMS (LA SOLUCIÓN CLAVE)
    items: Array<
        Omit<ItemWithPrismaRelations, 'toy' | 'createdAt' | 'updatedAt'> & { // Tipamos el OrderItem base
            createdAt: string;
            updatedAt: string;
            toy: Omit<ToyWithPrismaRelations, 'seller' | 'createdAt' | 'updatedAt'> & { // Tipamos el Toy base
                createdAt: string;
                updatedAt: string;
                // Sustituimos el tipo base del vendedor por el tipo extendido
                seller: NegotiatorWithReviewEligibility; 
            };
        }
    >;
};

export type OrdersResponse = ClientOrderWithItems[];