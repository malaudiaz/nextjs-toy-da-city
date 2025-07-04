"use server";

import { Toy } from "@/types/toy";
import { BACKEND_URL } from "../utils";

export type Filters = {
  search?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  locationRadius?: {
    lat: number;
    lng: number;
    radius: number;
  };
  locale?: string;
}

export async function getToys(page: number, perPage: number,locale: string, filters: Filters) {
  const start = page - 1 + 1 || 1;

  const url = new URL(`${BACKEND_URL}/${locale}/api/toys`);
  url.searchParams.set("page", String(start));
  url.searchParams.set('limit', String(perPage));

  if (typeof filters.search === 'string' && filters.search.trim()) {
    url.searchParams.set('search', encodeURIComponent(filters.search.trim()));
  }
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    url.searchParams.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    url.searchParams.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.locationRadius) {
    url.searchParams.set("lat", String(filters.locationRadius.lat));
    url.searchParams.set("lng", String(filters.locationRadius.lng));
    url.searchParams.set("radius", String(filters.locationRadius.radius));
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const toys = await response.json();

  return { toys: toys.data as Toy[], totalPosts: toys.pagination.total as number };
}

export async function getToy(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/toys/${id}`, {
    method: "GET",
  });

  const toy = await response.json();

  return toy;
}
