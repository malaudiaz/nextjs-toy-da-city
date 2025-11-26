import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { getLocale } from "next-intl/server";
import { UserData } from "@/app/[locale]/api/users/[id]/route";

export async function getUserById(id: string): Promise<UserData | null> {
  const { userId } = await auth();
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }
  const userUrl = `${BACKEND_URL}/${locale}/api/users/${id}`;

  const response = await fetch(userUrl, {
    method: "GET",
    headers: headers,
  });

  const toy = await response.json();
  return toy as UserData;
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