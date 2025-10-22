"use server";

import { Toy } from "@/types/toy";
import { BACKEND_URL } from "../utils";
import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";
import * as fs from "fs";
import * as path from "path";
import { promises as fsPromises } from "fs";
import { revalidatePath } from "next/cache"; // ← ¡ESTA LÍNEA FALTABA!
// types/modelTypes.ts
import { Prisma } from "@prisma/client";

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

// Asegúrate de que la carpeta de uploads exista
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

type FileType = "IMAGE" | "VIDEO";

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

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/${id}`, {
    method: "GET",
    headers: headers,
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
    headers: headers,
  });

  const toys = await response.json();

  return { toys: toys.data as Toy[] };
}

export async function getOwnToys() {
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
    headers: headers,
  });

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
      `${BACKEND_URL}/api/toys/for-sale?status=${status}`,
      {
        method: "GET",
        headers: headers,
      }
    );
    const toys = await response.json();
    return toys as Sale[];
  }

  const response = await fetch(`${BACKEND_URL}/api/toys/for-sale`, {
    method: "GET",
    headers: headers,
  });

  const sales = await response.json();
  return sales;
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
    headers: headers,
  });

  const free = await response.json();
  return free;
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
    headers: headers,
  });

  const favorites = await response.json();
  return favorites;
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
    headers: headers,
  });

  const swaps = await response.json();
  return swaps;
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
    headers: headers,
  });

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
  userId: string
): Promise<ToyWithMedia | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    const toy = await prisma.toy.findUnique({
      where: {
        id: toyId,
        sellerId: user?.id, // 🔐 Solo el dueño puede editarlo
        isActive: true, // Opcional: solo juguetes activos
      },
      include: {
        media: {
          select: {
            id: true,
            fileUrl: true,
            type: true,
          },
        },
      },
    });

    if (!toy) {
      return null;
    }

    return {
      ...toy,
      media: toy.media || [],
    };
  } catch (error) {
    console.error("Error fetching toy:", error);
    throw new Error("No se pudo cargar el juguete para edición");
  }
}

export async function updateToy(
  toyId: string,
  formData: FormData,
  userId: string // para verificar propiedad
) {
  // 1. Verificar que el juguete existe y pertenece al usuario
  const existingToy = await prisma.toy.findUnique({
    where: { id: toyId, sellerId: userId },
  });

  if (!existingToy) {
    throw new Error("Juguete no encontrado o no autorizado");
  }

  // 2. Extraer datos del formulario
  const title = formData.get("title")?.toString() || existingToy.title;
  const description =
    formData.get("description")?.toString() || existingToy.description;
  const forSell = formData.get("forSell") === "true";
  const forGifts = formData.get("forGifts") === "true";
  const forChanges = formData.get("forChanges") === "true";
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const categoryId = parseInt(
    formData.get("categoryId")?.toString() || existingToy.categoryId.toString()
  );
  const conditionId = parseInt(
    formData.get("conditionId")?.toString() ||
      existingToy.conditionId.toString()
  );
  const location = formData.get("location")?.toString() || existingToy.location;

  // 3. Manejo de imágenes
  const existingImageIds = formData.getAll("existingImageIds") as string[];
  const newFiles = formData.getAll("newFiles") as File[];

  // 3.1. Eliminar imágenes que NO están en existingImageIds
  const currentMedia = await prisma.media.findMany({
    where: { toyId: toyId },
    select: { id: true, fileUrl: true },
  });

  const mediaToDelete = currentMedia.filter(
    (media) => !existingImageIds.includes(media.id)
  );

  for (const media of mediaToDelete) {
    // Eliminar archivo del sistema de archivos
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        media.fileUrl.replace("/uploads/", "")
      );
      if (fs.existsSync(filePath)) {
        await fsPromises.unlink(filePath);
      }
    } catch (err) {
      console.warn("No se pudo eliminar archivo físico:", err);
    }

    // Eliminar de la base de datos
    await prisma.media.delete({ where: { id: media.id } });
  }

  // 3.2. Subir nuevas imágenes
  const newMedia: {
    fileUrl: string;
    type: FileType; // ← Ahora TypeScript sabe que solo acepta "IMAGE" o "VIDEO"
    toyId: string;
  }[] = [];

  for (const file of newFiles) {
    if (file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split(".").pop() || "jpg";
      const safeFileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}.${extension}`;
      const uploadPath = path.join(UPLOAD_DIR, safeFileName);

      // Guardar archivo
      await fsPromises.writeFile(uploadPath, buffer);

      // URL pública (asumiendo que sirves /public como /)
      const fileUrl = `/uploads/${safeFileName}`;

      newMedia.push({
        fileUrl,
        type: file.type.startsWith("image") ? "IMAGE" : ("VIDEO" as const), // ← ¡Así TypeScript sabe que es del enum!
        toyId: toyId,
      });
    }
  }

  // 3.3. Insertar nuevas imágenes en la DB
  if (newMedia.length > 0) {
    await prisma.media.createMany({ data: newMedia });
  }

  // 4. Actualizar el juguete
  const updatedToy = await prisma.toy.update({
    where: { id: toyId },
    data: {
      title,
      description,
      forSell,
      forGifts,
      forChanges,
      price,
      categoryId,
      conditionId,
      location,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/toy/${toyId}`);
  revalidatePath("/profile");

  return updatedToy;
}

export async function deleteToy(toyId: string) {
  const { userId } = await auth();

  const headers = {
    "Content-Type": "application/json",
    "X-User-ID": "",
  };

  if (userId) {
    headers["X-User-ID"] = userId;
  }
  console.log(toyId, userId);

  const toy = await fetch(`${BACKEND_URL}/api/toys/${toyId}`, {
    method: "DELETE",
    headers: headers,
  });

  const result = await toy.json();
  return result;
}
