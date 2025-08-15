//import MapComponent from '@/components/shared/MapComponent';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-dropdown-menu';
//import { control } from 'leaflet';
//import { register } from 'module';
import { useTranslations } from 'next-intl';
import React from 'react'
import { toyFormSchema, ToyFormValues } from "@/lib/schemas/toy";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const EditPostPage = () => {
    const t = useTranslations("createPostForm");

  const {
    register,
    formState: { errors },
    control,
  } = useForm<ToyFormValues>({
    resolver: zodResolver(toyFormSchema),
    mode: "onChange", // ← Asegúrate de tener esto
    defaultValues: {
      forSale: false,
      forGift: false,
      forChange: false,
      categoryId: undefined,
      //statusId: undefined,
      conditionId: undefined,
    },
  });


  return (
    <form
        className="flex flex-col gap-2 px-3 py-4 "
      >
        {/* Campo de título */}
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

        {/* Opciones adicionales */}
        <div className="flex flex-wrap gap-4">
          {/* For Sell */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="forSale"
              checked={useWatch({ control, name: "forSale" })}
              //onChange={() => handleCheckboxChange("forSale")}
              className="w-5 h-5 accent-green-700"
            />
            <label htmlFor="forSale">{t("ForSale")}</label>
          </div>

          {/* For Gift */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="forGift"
              checked={useWatch({ control, name: "forGift" })}
              //onChange={() => handleCheckboxChange("forGift")}
              className="w-5 h-5 accent-green-700"
            />
            <label htmlFor="forGift">{t("ForGift")}</label>
          </div>

          {/* For Exchange */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="forChange"
              checked={useWatch({ control, name: "forChange" })}
              //onChange={() => handleCheckboxChange("forChange")}
              className="w-5 h-5 accent-green-700"
            />
            <label htmlFor="forChange">{t("ForChange")}</label>
          </div>
        </div>

        {/*forSaleValue && ( */}

          <div className="flex flex-col gap-1">
            <label>{t("Price")}</label>
            <input
              id="price"
              type="number"
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
        
        {/* )} */}

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

{/*             {categories.data.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
 */}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Conditions */}
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

{/*             {conditions.data.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name}
              </option>
            ))}
 */}            
          </select>
          {errors.conditionId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.conditionId.message}
            </p>
          )}
        </div>

        {/* Imágenes */}
        <div className="flex flex-col gap-2 px-3 py-3 border-dashed border-2 border-gray-300 rounded-md">
          <Label>
            {t("Image")}
          </Label>
          <div className="grid grid-cols-3 gap-2">


{/*             {files.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image") && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
 */}
            {/* Botón para añadir más */}


{/*             <div

              className={`border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-32 ${
                files.length >= MAX_FILES ? "hidden" : ""
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-gray-500">{t("Add More")}</span>
            
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            multiple
            max={MAX_FILES}
          />
 */}
        </div>
        </div>

        <div className="h-[200px] w-full border-dashed border-2 border-gray-300 rounded-md overflow-hidden">

{/*           <MapComponent
            onLocationChange={handleLocationChange}
            initialPosition={userLocation}
          />
 */}          
        </div>

        {/* Botón de submit */}
        
{/*         <button
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
                xmlns="http://www.w3.org/2000/svg"
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
              {t("Uploading")}
            </span>
          ) : (
            t("Submit")
          )}


        </button>
 */}

      </form>
  )
}

export default EditPostPage
