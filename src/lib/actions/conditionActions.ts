"use server";
import { BACKEND_URL } from "../utils";

export async function getConditions() {
  const response = await fetch(`${BACKEND_URL}/api/condition`, {
    method: "GET",
  });
  return await response.json();
}
