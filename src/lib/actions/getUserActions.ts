import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";

// 1. Definición de tipo de datos del usuario que se devolverán
type UserData = {
  id: string; // ID de Prisma (id de la tabla 'users')
  fullName: string;
  imageUrl: string;
  clerkId: string;
  email: string;
  phone: string;
  role: string; // Incluir el rol para la validación/información
  reputation: number;
  reviewsCount: number; // Cantidad total de reseñas recibidas
}

export async function getUserById(userId: string): Promise<UserData | null> {
  if (!userId) return null;

try {
    // 1. Buscar usuario en Prisma, obteniendo su clerkId, reputación y rol.
    // También contamos directamente las reseñas recibidas.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clerkId: true,
        reputation: true,
        role: true, // Necesitamos el rol para la validación
        reviewsReceived: { // Contar las reseñas recibidas
          select: { id: true },
        },
      },
    });

    // 2. Validación de existencia y rol.
    if (!user) {
      console.warn(`Usuario con ID ${userId} no encontrado en Prisma.`);
      return null;
    }

    // El requisito es que "tenga el roll de seller". Si es 'seller' (vendedor):
    if (user.role !== "seller") {
      console.warn(`Usuario ${userId} tiene el rol "${user.role}" en lugar de "buyer".`);
      return null;
    }

    // 3. Obtener datos de Clerk usando el clerkId.
    const { users } = await clerkClient();
    const seller = await users.getUser(user!.clerkId);

    // 4. Desestructuración y formateo de datos
    const { firstName, lastName, imageUrl, id: clerkId, emailAddresses, phoneNumbers } = seller;
    const fullName = `${firstName} ${lastName}`.trim() || "Usuario anónimo";

    // 5. Construir y devolver el objeto UserData
    return {
      id: user.id, // ID de la tabla 'users'
      fullName,
      imageUrl,
      clerkId: clerkId, // ID de Clerk
      email: emailAddresses[0]?.emailAddress || "",
      phone: phoneNumbers[0]?.phoneNumber || "",
      role: user.role, // Rol validado
      reputation: user.reputation ?? 0, // Usar 0 si es null
      reviewsCount: user.reviewsReceived.length, // Cantidad de reseñas
    };
  } catch (error) {
    console.error("Error al obtener usuario", error);
    return null;
  }
}

type Users = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clerkId: string;
  role: string;
  reputation: number;
}

export async function getOnlineUsers() {
  const { userId } = await auth();

  // 👇 Detectar el idioma del navegador o usar uno por defecto
  const userLocale = navigator.language.split('-')[0]; // 'es', 'en', etc.


  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
    "Accept-Language": userLocale, // 👈 Enviamos el idioma aquí
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${userLocale}/api/users/online`, {
    method: "GET",
    headers: headers
  });

  const users = await response.json();

  return { users: users.onlineUsers as Users[], count: users.count as number };
}

export async function getUserImageUrl(userId: string) {
  if (!userId) return null;

  try {
    const { users } = await clerkClient();
    const seller = await users.getUser(userId);

    return seller.imageUrl;
  } catch (error) {
    console.error("Error al obtener usuario de Clerk:", error);
    return null;
  }
}