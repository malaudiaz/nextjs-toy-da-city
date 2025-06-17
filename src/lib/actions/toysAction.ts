"use server";

import { CreateToyFormState } from "@/types/formState";
import { BACKEND_URL } from "../utils";
import { ToySchema } from "../schemas/toy";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const totalPosts = toys.pagination.total;

  return { toys, totalPosts };
}

export async function createToy(
  formState: CreateToyFormState,
  formData: FormData
): Promise<CreateToyFormState> {
  const entries = Object.fromEntries(formData.entries());
  const rawData = {
    title: entries.title as string,
    description: entries.description as string,
    price: Number(entries.price),
    categoryId: Number(entries.categoryId),
    statusId: Number(entries.statusId),
    conditionId: Number(entries.conditionId),
    forSell: entries.forSell === "true",
    forGifts: entries.forGifts === "true",
    forChanges: entries.forChanges === "true",
    location: entries.location as string,
  };

  const validatedFields = ToySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      data: rawData,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const clerkAuth = await auth();

  const token = await clerkAuth.getToken(); 

  try {
    const finalFormData = new FormData();

    finalFormData.append("title", validatedFields.data.title);
    finalFormData.append("description", validatedFields.data.description);
    finalFormData.append("price", String(validatedFields.data.price));
    finalFormData.append("categoryId", String(validatedFields.data.categoryId));
    finalFormData.append("statusId", String(validatedFields.data.statusId));
    finalFormData.append(
      "conditionId",
      String(validatedFields.data.conditionId)
    );
    finalFormData.append("forSell", String(validatedFields.data.forSell));
    finalFormData.append("forGifts", String(validatedFields.data.forGifts));
    finalFormData.append("forChanges", String(validatedFields.data.forChanges));
    finalFormData.append("location", validatedFields.data.location);

    // Imágenes
    const mediaFiles = formData.getAll("media") as File[];

    mediaFiles.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        finalFormData.append("media", file);
      }
    });

    const response = await fetch(`${BACKEND_URL}/api/toys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: finalFormData,
    });
    console.log(response);
    if (response.ok)
      return {
        data: Object.fromEntries(formData.entries()),
        errors: {},
      };
    return {
      data: await response.json(),
      errors: {},
      message: response.statusText,
    };
  } catch (error: any) {
    console.error("Error en createToy:", error.message);
  }
}
