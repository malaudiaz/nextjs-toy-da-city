import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";

export async function getFavoriteById(id: string) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/favoritetoys/${id}`, {
    method: "GET",
    headers: headers
  });
  return response.json();
}
