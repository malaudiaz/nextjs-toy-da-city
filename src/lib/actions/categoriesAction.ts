"use server";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "../auth";
import { BACKEND_URL } from "../utils";

export async function getCategories() {
     const response = await fetch(`${BACKEND_URL}/api/categories`, {
      method: "GET"
    });
    return await response.json();
}
