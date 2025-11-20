"use server";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { revalidatePath } from "next/cache";
import { getLocale } from 'next-intl/server';
import type { ClientOrderWithItems } from "@/types/prisma-types";

export type OrderStatus =
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELED"
  | "TRANSFERRED"
  | "REEMBURSED";


export async function getOrder(status?: OrderStatus): Promise<ClientOrderWithItems[]> {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(
    `${BACKEND_URL}/${locale}/api/get-order/purchase?status=${status}`,
    {
      method: "GET",
      headers: headers,
    }
  );
  const order = await response.json();
  return order as ClientOrderWithItems[];
}

export async function cancelOrder(orderId: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();
  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${locale}/api/cancel-order`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ orderId }),
    });
    const result = await response.json();
    
    // Solo revalida si la respuesta fue exitosa
    if (response.ok) {
      revalidatePath(`/${locale}/config/purchases`);
    }
    
    return result;    
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error canceling order" };
  }
}

export async function confirmOrder(orderId: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();
  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${locale}/api/confirm-delivery`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ orderId }),
    });

    const result = await response.json();
    
    // Solo revalida si la respuesta fue exitosa
    if (response.ok) {
      revalidatePath(`/${locale}/config/purchases`);
    }
    
    return result;    
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error confirming order" };
  }
}
