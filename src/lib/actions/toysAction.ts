"use server";

import { Toy } from "@/types/toy";
import { BACKEND_URL } from "../utils";

export async function getToys(page: number, perPage: number) {
  const start = page - 1 + 1 || 1;

  const response = await fetch(
    `${BACKEND_URL}/api/toys?page=${start}&limit=${perPage}`,
    {
      method: "GET",
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const toys = await response.json();

  return { toys: toys.data as Toy[], totalPosts: toys.pagination.total};
}
