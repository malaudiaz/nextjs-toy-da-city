"use server";

import { Toy } from "@/types/toy";
import { BACKEND_URL } from "../utils";
import { auth } from "@clerk/nextjs/server";
import * as fs from "fs";
import * as path from "path";
import { Prisma } from "@prisma/client";
import { getLocale } from "next-intl/server";

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
  forSell?: boolean;
  forGifts?: boolean;
  forChanges?: boolean;
  conditions?: string;
};

// Asegúrate de que la carpeta de uploads exista
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// type FileType = "IMAGE" | "VIDEO";

export async function getToys(
  page: number,
  perPage: number,
  locale: string,
  filters: Filters
) {
  const { userId } = await auth();

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

if (filters.forSell !== undefined) {
    url.searchParams.set("forSell", String(filters.forSell));
  }
  if (filters.forGifts !== undefined) {
    url.searchParams.set("forGifts", String(filters.forGifts));
  }
  if (filters.forChanges !== undefined) {
    url.searchParams.set("forChanges", String(filters.forChanges));
  }

  // Filtros de Condiciones
  if (typeof filters.conditions === "string" && filters.conditions.trim()) {
    url.searchParams.set("conditions", filters.conditions.trim());
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
    headers: headers,
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
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/toys/${id}`, {
    method: "GET",
    headers: headers,
  });

  const toy = await response.json();

  return toy;
}

export async function getRelatedToys(id: string) {
  const { userId } = await auth();
  const locale = await getLocale(); // ✅ Obtiene el locale actual

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(
    `${BACKEND_URL}/${locale}/api/toys/${id}/related`,
    {
      method: "GET",
      headers: headers,
    }
  );

  const toys = await response.json();

  return { toys: toys.data as Toy[] };
}

export async function getOwnToys() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/toys/own`, {
    method: "GET",
    headers: headers,
  });

  console.log("Response", response);

  const toys = await response.json();
  return toys as Toy[];
}

export type SalesStatus = "available" | "reserved" | "sold" | "canceled";

// Actualiza el tipo Sale para que coincida exactamente con tu consulta
export type Sale = Prisma.ToyGetPayload<{
  include: {
    media: true;
    category: true;
    condition: true;
    status: true;
    seller: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    orderItems: {
      include: {
        order: {
          include: {
            buyer: {
              select: {
                id: true;
                name: true;
                email: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function getSales(status?: SalesStatus): Promise<Sale[]> {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  if (status) {
    const response = await fetch(
      `${BACKEND_URL}/${locale}/api/toys/for-sale?status=${status}`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const toys = await response.json();
    return toys as Sale[];
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/toys/for-sale`, {
    method: "GET",
    headers: headers,
  });

  const sales = await response.json();
  return sales;
}

export async function getFree() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/toys/for-free`, {
    method: "GET",
    headers: headers,
  });

  const free = await response.json();
  return free;
}

export async function getFavorites() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/toys/favorites`, {
    method: "GET",
    headers: headers,
  });

  const favorites = await response.json();
  return favorites;
}

export async function getSwaps() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/${locale}/api/toys/for-swap`, {
    method: "GET",
    headers: headers,
  });

  const swaps = await response.json();
  return swaps;
}

export async function getMessages() {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(
    `${BACKEND_URL}/${locale}/api/toys/with-messages`,
    {
      method: "GET",
      headers: headers,
    }
  );

  const messages = await response.json();
  return messages;
}

export type ToyWithMedia = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string | null; // ← Cambiado: permite null
  forSell: boolean; // ← ¡Así se llama en Prisma!
  forGifts: boolean; // ← ¡Así se llama en Prisma!
  forChanges: boolean; // ← ¡Así se llama en Prisma!
  categoryId: number;
  conditionId: number;
  statusId: number;
  sellerId: string;
  media: {
    id: string;
    fileUrl: string;
    type: "IMAGE" | "VIDEO";
  }[];
};

// ✅ Acción para obtener un juguete por ID y verificar que pertenece al usuario
export async function getToyById(
  toyId: string,
  locale?: string
): Promise<ToyWithMedia | null> {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }
  const toyUrl = `${BACKEND_URL}/${locale}/api/toys/${toyId}`;

  const response = await fetch(toyUrl, {
    method: "GET",
    headers: headers,
  });

  const toy = await response.json();
  return toy;
}

export async function deleteToy(toyId: string) {
  const locale = await getLocale(); // ✅ Obtiene el locale actual
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const toy = await fetch(`${BACKEND_URL}/${locale}/api/toys/${toyId}`, {
    method: "DELETE",
    headers: headers,
  });

  const result = await toy.json();
  return result;
}
