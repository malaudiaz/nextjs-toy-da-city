"use server";
import { Condition } from "@/types/modelTypes";
import { BACKEND_URL } from "../utils";
import { getLocale } from 'next-intl/server';

export async function getConditions() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const response = await fetch(`${BACKEND_URL}/${locale}/api/condition`, {
    method: "GET",
  });
  
  const conditions = await response.json();
  return conditions.data as Condition[] 
}
