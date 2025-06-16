"use server";

import { BACKEND_URL } from "../utils";

export async function getToys() {

    const response = await fetch(`${BACKEND_URL}/api/toys`, {
      method: "GET"
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return await response.json();
}