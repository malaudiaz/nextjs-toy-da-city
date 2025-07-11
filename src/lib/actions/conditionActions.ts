"use server";
import { Condition } from "@/types/modelTypes";
import { BACKEND_URL } from "../utils";

export async function getConditions() {
  const response = await fetch(`${BACKEND_URL}/api/condition`, {
    method: "GET",
  });
  
  const conditions = await response.json();
  return conditions.data as Condition[] 
}
