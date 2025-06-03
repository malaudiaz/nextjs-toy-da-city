'use client'

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { ChangeEvent, useRef, useState } from "react";
import SelectItems from "./SelectItems";
import Image from "next/image";

const categories = [
  "Toy",
  "Game",
  "Art",
  "Book",
  "Music",
  "Movie",
  "Video",
  "Other",
];
const MAX_FILES = 6

const CreatePostForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

    if (files.length + newFiles.length > MAX_FILES) {
        setError(`Solo puedes subir un máximo de ${MAX_FILES} archivos`)
        return
    }      

      setFiles(prev => [...prev, ...newFiles])
    }
  }
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form action="" className="flex flex-col gap-2 px-3 py-4">
      <Label>Excelent username what do you want to post?</Label>
      <Textarea className="h-20 border-gray-500" />
      <SelectItems label="What type of post is this?" items={categories} />
      <SelectItems label="Select" items={categories} />
      <div className="flex flex-col gap-2 px-3 py-3 border-2 border-dashed border-gray-500 rounded-md">
        <Label>
          Take picture of your item and upload them to improve the result
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image') && (
                 <Image 
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

          {/* Botón para añadir más archivos */}
          <div
            className={`border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-32 ${files.length === MAX_FILES ? 'hidden' : ''}`}
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
        />
      </div>
      <Textarea
        placeholder="Describe your item"
        className="h-20 border-gray-500"
      />
      <SelectItems label="Select a category" items={categories} />

       <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#3D5D3C] text-white py-3 rounded-lg font-medium hover:bg-[#3e6e3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : 'Create Post'}
        </button>
    </form>
  );
};

export default CreatePostForm;
