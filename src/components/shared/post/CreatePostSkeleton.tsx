// components/shared/post/CreatePostSkeleton.jsx

const CreatePostSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 px-3 py-4 animate-pulse">
      {/* Título y Descripción */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div> {/* Label */}
        <div className="h-10 w-full bg-gray-200 rounded"></div> {/* Input Title */}
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div> {/* Label */}
        <div className="h-20 w-full bg-gray-200 rounded"></div> {/* Textarea Description */}
      </div>

      {/* Opciones (Checkboxes) */}
      <div className="flex flex-wrap gap-4">
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Selects (Categoría y Condición) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div> {/* Label Category */}
          <div className="h-10 w-full bg-gray-200 rounded"></div> {/* Select Category */}
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div> {/* Label Condition */}
          <div className="h-10 w-full bg-gray-200 rounded"></div> {/* Select Condition */}
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div> {/* Label Status */}
          <div className="h-10 w-full bg-gray-200 rounded"></div> {/* Select Status */}
        </div>
      </div>

      {/* Área de Imágenes */}
      <div className="h-40 w-full border-dashed border-2 border-gray-300 rounded-md bg-gray-100 flex items-center justify-center">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* Mapa (Placeholder) */}
      <div className="h-[200px] w-full bg-gray-200 rounded-md"></div>

      {/* Botón de Submit */}
      <div className="h-12 w-full bg-gray-400 rounded-lg"></div>
    </div>
  );
};

export default CreatePostSkeleton;