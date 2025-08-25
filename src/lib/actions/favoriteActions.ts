import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "../utils";

export async function getFavoriteById(id: string,token: string) {
    const response = await fetch(`${BACKEND_URL}/api/favoritetoys/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    })
    return response.json()
}