"use server";
import { BACKEND_URL } from "../utils";
import { getLocale } from 'next-intl/server';
import { Status } from "@/types/modelTypes";

export async function getStatuses() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const response = await fetch(`${BACKEND_URL}/${locale}/api/status`, {
    method: "GET",
  });
  const statuses = await response.json();
  return statuses.data as Status[] 
}
