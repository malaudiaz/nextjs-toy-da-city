"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import SelectItems from "./SelectItems";
import dynamic from 'next/dynamic';

const MAX_FILES = 6;

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

type CreatePostFormProps = {
  categories: {
    data: Category[];
  };
  conditions: {
    data: Condition[];
  };
};
const POST_TYPES = ['For Sell', 'For Gifts', 'For Exchange'];
type PostType = (typeof POST_TYPES)[number];

// Importación dinámica con exportación por defecto correcta
const MapComponent = dynamic(
  () => import('../MapComponent').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center">Cargando mapa...</div>
  }
);


const CreatePostForm = ({ categories, conditions }: CreatePostFormProps) => {
  const [postType, setPostType] = useState<PostType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);


  const getUserLocation = () => {
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      if (files.length + newFiles.length > MAX_FILES) {
        setError(`Solo puedes subir un máximo de ${MAX_FILES} archivos`);
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setUserLocation([lat, lng]);
  };

  return (
    <form className="flex flex-col gap-2 px-3 py-4">
      {/* Campo de título */}
      <div className="flex flex-col gap-1">
        <Label>Title</Label>
        <input
          name="title"
          placeholder="Nombre del producto"
          className="border border-gray-300 rounded p-2"
          required
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-1">
        <Label>Description</Label>
        <Textarea
          name="description"
          placeholder="Describe tu producto"
          className="h-20 border-gray-500"
          required
        />
      </div>

      {/* Precio */}
     {(postType === 'For Sell' ) && (
        <div className="flex flex-col gap-1">
          <label>Price</label>
          <input
            name="price"
            type="number"
            min="0"
            className="border border-gray-300 rounded p-2"
            required
          />
        </div>
      )}

      {/* Ubicación */}
      <div className="flex flex-col gap-1">
        <Label>Location</Label>
        <input
          name="location"
          placeholder="Ciudad, País"
          className="border border-gray-300 rounded p-2"
          required
        />
      </div>

      {/* Categoría */}
      <SelectItems
        label="Select a category"
        items={categories.data.map((category) => category.description)}
      />

      {/* Estado (statusId) */}
      <SelectItems
        label="What type of post is this?"
        items={POST_TYPES}
        onValueChange={(value) => setPostType(value as PostType)}
      />

      {/* Condición (conditionId) */}
      <SelectItems
        label="Condition"
        items={conditions.data.map((condition) => condition.description)}
      />

      {/* Imágenes */}
      <div className="flex flex-col gap-2 px-3 py-3 border-dashed border-2 border-gray-300 rounded-md">
        <Label>
          Take picture of your item and upload them to improve the result
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
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

          {/* Botón para añadir más */}
          <div
            className={`border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-32 ${
              files.length >= MAX_FILES ? "hidden" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-gray-500">+ Add More</span>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          multiple
          max={MAX_FILES}
        />
      </div>

      <div className="h-[200px] w-full border-dashed border-2 border-gray-300 rounded-md overflow-hidden">
        <MapComponent 
          onLocationChange={handleLocationChange} 
          initialPosition={userLocation} 
        />
      </div>


      {/* Botón de submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#3D5D3C] text-white py-3 rounded-lg font-medium hover:bg-[#3e6e3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
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
            Uploading...
          </span>
        ) : (
          "Create Post"
        )}
      </button>
    </form>
  );
};

export default CreatePostForm;
