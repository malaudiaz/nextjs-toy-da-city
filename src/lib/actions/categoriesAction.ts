"use server";
import { BACKEND_URL } from "../utils";

export async function getCategories() {
     const response = await fetch(`${BACKEND_URL}/api/categories`, {
      method: "GET"
    });
    return await response.json();
}
