import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";
import { getLocale } from 'next-intl/server';

export async function getFavoriteById(id: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/favoritetoys/${id}`, {
    method: "GET",
    headers: headers
  });
  return response.json();
}
