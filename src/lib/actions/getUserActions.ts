import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";

type UserData = {
  id: string;
  fullName: string;
  imageUrl: string;
  clerkId: string;
  email: string;
  phone?: string;
  reputation?: number;
  reviews?: number;
};

export async function getUserById(userId: string): Promise<UserData | null> {
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { clerkId: true, reputation: true },
  });

  try {
    const { users } = await clerkClient();
    const seller = await users.getUser(user!.clerkId);

    const { firstName, lastName, imageUrl, id: clerkId, emailAddresses, phoneNumbers } = seller;
    const fullName = `${firstName} ${lastName}`.trim() || "Usuario anónimo";

    return {
      id: seller.id,
      fullName,
      imageUrl,
      clerkId,
      email: emailAddresses[0]?.emailAddress || "",
      phone: phoneNumbers[0]?.phoneNumber || "",
      reputation: user?.reputation || 0,
      reviews: user?.reputation || 0
    };
  } catch (error) {
    console.error("Error al obtener usuario de Clerk:", error);
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