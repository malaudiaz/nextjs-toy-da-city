"use server";

import { Toy } from "@/types/toy";
import { BACKEND_URL } from "../utils";
import { auth } from "@clerk/nextjs/server";

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
};

export async function getToys(
  page: number,
  perPage: number,
  locale: string,
  filters: Filters
) {

  const { userId } = await 
  auth();

  const start = page - 1 + 1 || 1;

  const url = new URL(`${BACKEND_URL}/${locale}/api/toys`);
  url.searchParams.set("page", String(start));
  url.searchParams.set("limit", String(perPage));

  if (typeof filters.search === "string" && filters.search.trim()) {
    url.searchParams.set("search", encodeURIComponent(filters.search.trim()));
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

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: headers
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const toys = await response.json();

  return {
    toys: toys.data as Toy[],
    totalPosts: toys.pagination.total as number | 0,
  };
}

export async function getToy(id: string) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/${id}`, {
    method: "GET",
    headers: headers
  });

  const toy = await response.json();

  return toy;
}

export async function getRelatedToys(id: string) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/${id}/related`, {
    method: "GET",
    headers: headers
  });

  const toys = await response.json();

  return { toys: toys.data as Toy[] };
}

export async function getOwnToys(){
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/own`, {
    method: "GET",
    headers: headers
  });

  const toys = await response.json();
  return toys as Toy[];
}

export type SalesStatus = "available" | "reserved" | "sold" | "canceled";

export async function getSales(status?: SalesStatus) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  if (status) {
    const response = await fetch(`${BACKEND_URL}/api/toys/for-sale?status=${status}`, {
      method: "GET",
      headers: headers
    });
    const sales = await response.json();
    return  sales;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/for-sale`, {
    method: "GET",
    headers: headers
  });

  const sales = await response.json();
  return  sales;
}

export async function getFree() {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/for-free`, {
    method: "GET",
    headers: headers
  });

  const free = await response.json();
  return  free;
}

export async function getFavorites() {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/favorites`, {
    method: "GET",
    headers: headers
  });

  const favorites = await response.json();
  return  favorites;
}

export async function getSwaps() {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/for-swap`, {
    method: "GET",
    headers: headers
  });

  const swaps = await response.json();
  return  swaps;
}

export async function getMessages() {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/with-messages`, {
    method: "GET",
    headers: headers
  });

  const messages = await response.json();
  return  messages;
}