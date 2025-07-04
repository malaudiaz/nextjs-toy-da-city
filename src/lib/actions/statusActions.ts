"use server";
import { BACKEND_URL } from "../utils";

export async function getStatuses() {
  const response = await fetch(`${BACKEND_URL}/api/status`, {
    method: "GET",
  });
  return await response.json();
}
