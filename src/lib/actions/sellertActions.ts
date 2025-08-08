"use server";
import { BACKEND_URL } from "../utils";
import { getLocale } from 'next-intl/server';

export async function getSellerData(id: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const response = await fetch(`${BACKEND_URL}/${locale}/api/users/${id}/validate-seller`, {
    method: "GET",
  });
  
  const result = await response.json();
  return result
}
