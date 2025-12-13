"use server";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { revalidatePath } from "next/cache";
import { getLocale } from 'next-intl/server';
import { Order } from "@/types/modelTypes";

export type OrderStatus =
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELED"
  | "TRANSFERRED"
  | "REEMBURSED";


export async function getOrder(page:number, perPage:number, status?: OrderStatus) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const start = page - 1 + 1 || 1;
  const url = new URL(`${BACKEND_URL}/${locale}/api/get-order/purchase?page=${start}&limit=${perPage}`);
  if (status) {
    url.searchParams.append("status", status);
  }

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: headers,
    }
  );
  const res = await response.json();
  return {purchases:res.data as Order[] , totalPosts: res.pagination.total as number | 0, totalPages: res.pagination.totalPages as number};
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
