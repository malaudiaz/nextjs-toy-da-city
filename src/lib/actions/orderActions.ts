"use server";
import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { Order } from "@/types/modelTypes";
import { revalidatePath } from "next/cache";

export type OrderStatus =
  | "AWAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELED"
  | "TRANSFERRED"
  | "REEMBURSED";

export async function getOrder(status?: OrderStatus) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(
    `${BACKEND_URL}/api/get-order/purchase?status=${status}`,
    {
      method: "GET",
      headers: headers,
    }
  );
  const order = await response.json();
  return order as Order[];
}

export async function cancelOrder(orderId: string) {
  const { userId } = await auth();
  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/cancel-order`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ orderId }),
    });
    const result = await response.json();
    
    // Solo revalida si la respuesta fue exitosa
    if (response.ok) {
      revalidatePath("/[locale]/config/purchases");
    }
    
    return result;    
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error canceling order" };
  }
}

export async function confirmOrder(orderId: string) {
  const { userId } = await auth();
  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/confirm-delivery`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ orderId }),
    });

    const result = await response.json();
    
    // Solo revalida si la respuesta fue exitosa
    if (response.ok) {
      revalidatePath("/[locale]/config/purchases");
    }
    
    return result;    
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error confirming order" };
  }
}
