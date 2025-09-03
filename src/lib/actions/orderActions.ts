import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { Order } from "@/types/modelTypes";

export type OrderStatus = "AWAITING_CONFIRMATION" | "CONFIRMED" | "CANCELED" | "TRANSFERRED" | "REEMBURSED";

export async function getOrder(status?: OrderStatus) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/get-order?status=${status}`, {
    method: "GET",
    headers: headers
  });
  const order = await response.json();
  return  order as Order[];
}
