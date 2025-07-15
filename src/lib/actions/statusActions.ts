"use server";
import { BACKEND_URL } from "../utils";
import { getLocale } from 'next-intl/server';

export async function getStatuses() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const response = await fetch(`${BACKEND_URL}/${locale}/api/status`, {
    method: "GET",
  });
  return await response.json();
}
