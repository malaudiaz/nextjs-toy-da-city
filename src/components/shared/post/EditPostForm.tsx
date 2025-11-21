// components/shared/post/EditPostForm.jsx
"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toyFormSchema, ToyFormValues } from "@/lib/schemas/toy";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";

const MAX_FILES = 6;

type Status = { // (Añade este tipo si no está en un archivo de tipos compartido)
  id: number;
  name: string;
  description: string;
  isActive: boolean;
};

type Category = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
};

type Condition = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
};

type Toy = {
  id: string;
  title: string;
  description: string;
  forSell: boolean; // ← ¡Así se llama en Prisma!
  forGifts: boolean; // ← ¡Así se llama en Prisma!
  forChanges: boolean; // ← ¡Así se llama en Prisma!
  price?: number;
  categoryId: number;
  conditionId: number;
  statusId: number; // ✨ NUEVO
  location: string | null; // "lat,lng"
  media: { id: string; fileUrl: string }[]; // ← Asumiendo que guardas imágenes en la DB con ID y URL
};

type EditPostFormProps = {
  toy: Toy;
  categories: {
    data: Category[];
  };
  conditions: {
    data: Condition[];
  };
  statuses: { // ✨ NUEVO
    data: Status[];
  };
};

const MapComponent = dynamic(
  () => import("../MapComponent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center">
        Cargando mapa...
      </div>
    ),
  }
);

const EditPostForm = ({ toy, categories, conditions, statuses }: EditPostFormProps) => {
  const t = useTranslations("createPostForm");
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: string; fileUrl: string }[]
  >(toy.media || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialLocation = toy.location
    ? (toy.location.split(",").map(Number) as [number, number])
    : null;

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    initialLocation
  );

  const { getToken } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    getValues,
    setValue,
    watch,
  } = useForm<ToyFormValues>({
    resolver: zodResolver(toyFormSchema),
    mode: "onChange",
    defaultValues: {
      title: toy.title,
      description: toy.description,
      forSale: toy.forSell,
      forGift: toy.forGifts,
      forChange: toy.forChanges,
      price: toy.price || undefined,
      categoryId: toy.categoryId,
      conditionId: toy.conditionId,
      statusId: toy.statusId,
    },
  });

  const forSaleValue = useWatch({
    control,
    name: "forSale",
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    if (!userLocation) getUserLocation();
  }, [userLocation]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + existingImages.length + newFiles.length;

      if (totalFiles > MAX_FILES) {
        setError(`Solo puedes tener un máximo de ${MAX_FILES} imágenes`);
        return;
      }

      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number, isExisting = false) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const newFiles = [...files];
      newFiles.splice(index - existingImages.length, 1);
      setFiles(newFiles);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setUserLocation([lat, lng]);
  };

  const onSubmit = async (data: ToyFormValues) => {
    const token = await getToken({ template: "Toydacity" });
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      // Campos del formulario
      Object.entries(data).forEach(([key, value]) => {
        if (key === "price" && !data.forSale) return;
        formData.append(key, value?.toString() ?? "");
      });

      // Ubicación
      const location = userLocation
        ? `${userLocation[0]},${userLocation[1]}`
        : "";
      formData.append("location", location);

      files.forEach((file) => {
        formData.append("newFiles", file); // ← ¡CAMBIADO DE "newFiles" a "file"!
      });

      // IDs de imágenes existentes que se mantienen
      existingImages.forEach((img) => {
        formData.append("existingImageIds", img.id);
      });

      // IDs de imágenes que se ELIMINARON → ¡ESTO FALTABA!
      const deletedImageIds = toy.media
        .filter((img) => !existingImages.some((e) => e.id === img.id))
        .map((img) => img.id);

      deletedImageIds.forEach((id) => {
        formData.append("deleteMedia", id);
      });

      const response = await fetch(`/api/toys/${toy.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSubmitError(errorData.error || "Error al actualizar el juguete");
        return;
      }

      setSubmitSuccess(true);
      reset();
      setFiles([]);
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (name: "forSale" | "forGift" | "forChange") => {
    const currentValue = getValues(name);
    // Si ya está activo, lo dejamos como está (opcional)
    if (currentValue) return;

    // Desactivamos todos
    setValue("forSale", false);
    setValue("forGift", false);
    setValue("forChange", false);

    // Activamos solo el seleccionado
    setValue(name, true);
  };  

  return (
    <>
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {t("UpdateSuccessMessage")}
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 px-3 py-4"
      >
        {/* Título */}
        <div className="flex flex-col gap-1">
          <Label>{t("Title")}</Label>
          <input
            id="title"
            placeholder={t("TitlePlaceholder")}
            className="border border-gray-300 rounded p-2"
            {...register("title")}
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <Label>{t("Description")}</Label>
          <Textarea
            id="description"
            placeholder={t("DescriptionPlaceholder")}
            className="h-20 border-gray-500"
            rows={4}
            {...register("description")}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Opciones */}
        <div className="flex flex-wrap gap-4">
          {(["forSale", "forGift", "forChange"] as const).map((option) => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={option}
                checked={watch(option)}
                onChange={() => handleCheckboxChange(option)}
                className="w-5 h-5 accent-green-700"
              />
              <label htmlFor={option}>{t(option)}</label>
            </div>
          ))}
        </div>

        {forSaleValue && (
          <div className="flex flex-col gap-1">
            <label>{t("Price")}</label>
            <input
              id="price"
              type="number"
              step="any"
              min="0"
              className="border border-gray-300 rounded p-2"
              {...register("price", { valueAsNumber: true })}
              required
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
        )}

        {/* Categoría */}
        <div>
          <label htmlFor="categoryId" className="block mb-1">
            {t("Category")}
          </label>
          <select
            id="categoryId"
            className="w-full p-2 border rounded"
            {...register("categoryId", { valueAsNumber: true })}
            required
          >
            {categories.data.map((category) => (
              <option key={category.id} value={category.id}>
                {category.description}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Condición */}
        <div>
          <label htmlFor="conditionId" className="block mb-1">
            {t("Condition")}
          </label>
          <select
            id="conditionId"
            className="w-full p-2 border rounded"
            {...register("conditionId", { valueAsNumber: true })}
            required
          >
            {conditions.data.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.description}
              </option>
            ))}
          </select>
          {errors.conditionId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.conditionId.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="statusId" className="block mb-1">
            {t("Status")} {/* Asumiendo que tienes una traducción para "Status" */}
          </label>
          <select
            id="statusId"
            className="w-full p-2 border rounded"
            // Asegúrate de que toyFormSchema incluya 'statusId' como un número
            {...register("statusId", { valueAsNumber: true })} 
            required
          >
            {/* Opcional: Opción por defecto deshabilitada/vacía si defaultValues.statusId es undefined */}
            <option value="" disabled hidden>{t("SelectStatusPlaceholder")}</option>           
            {statuses.data.map((status) => (
              <option key={status.id} value={status.id}>
                {status.description} {/* Usar description si es el campo localizado */}
              </option>
            ))}

          </select>
          {errors.statusId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.statusId.message}
            </p>
          )}
        </div>        

        {/* Imágenes (existentes + nuevas) */}
        <div className="flex flex-col gap-2 px-3 py-3 border-dashed border-2 border-gray-300 rounded-md">
          <Label>{t("Image")}</Label>
          <div className="grid grid-cols-3 gap-2">
            {/* Imágenes existentes */}
            {existingImages.map((img, index) => (
              <div key={img.id} className="relative group">
                <Image
                  src={img.fileUrl}
                  alt={`Existing ${index}`}
                  className="w-full h-32 object-cover rounded border"
                  width={150}
                  height={150}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index, true)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}

            {/* Imágenes nuevas (previsualización) */}
            {files.map((file, index) => (
              <div
                key={index + existingImages.length}
                className="relative group"
              >
                {file.type.startsWith("image") && (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded border"
                    width={150}
                    height={150}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index + existingImages.length)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}

            {/* Botón para añadir más (si no se ha alcanzado el límite) */}
            {existingImages.length + files.length < MAX_FILES && (
              <div
                className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-32"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-gray-500">{t("Add More")}</span>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>

        {/* Mapa */}
        <div className="h-[200px] w-full border-dashed border-2 border-gray-300 rounded-md overflow-hidden">
          <MapComponent
            onLocationChange={handleLocationChange}
            initialPosition={userLocation}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#3D5D3C] text-white py-3 rounded-lg font-medium hover:bg-[#3e6e3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("Updating")}
            </span>
          ) : (
            t("UpdateToy")
          )}
        </button>
      </form>
    </>
  );
};

export default EditPostForm;
