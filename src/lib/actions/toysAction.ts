"use server";

import { Toy } from "@/types/toy";
import { BACKEND_URL } from "../utils";

export async function getToys(page: number, perPage: number, search?: string) {
  const start = page - 1 + 1 || 1;

  const url = new URL(`${BACKEND_URL}/api/toys`);
  url.searchParams.set("page", String(start));
  url.searchParams.set('limit', String(perPage));

  if (search && search.trim()) {
    url.searchParams.set('search', encodeURIComponent(search.trim()));
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const toys = await response.json();

  return { toys: toys.data as Toy[], totalPosts: toys.pagination.total };
}

export async function getToy(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/toys/${id}`, {
    method: "GET",
  });

  const toy = await response.json();

  return toy;
}
