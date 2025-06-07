import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import StatusBadge from './StatusBadge';

type ProductCardProps = {
  description: string;
  image?: string;
  price: string;
  status: string;
  location: string;
};

const ProductCard = ({
  description,
  image,
  price,
  location,
  status,
}: ProductCardProps) => {
  return (
    <div className="flex flex-col h-[300px] overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="w-full h-1/2 relative bg-gray-200">
        <Image
          src={image || "/placeholder.svg"}
          alt="product"
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido inferior */}
      <div className="flex flex-col p-3 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl text-green-700 font-medium">${price}</span>
          <button
            type="button"
            aria-label="Agregar a favoritos"
            className="bg-white p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-6 w-6 text-black" />
          </button>
        </div>

         <StatusBadge status={status}/>

        {/* Descripción truncada */}
        <p className="line-clamp-2 min-h-[40px] text-gray-600 mb-2 flex-grow">
          {description}
        </p>

        {/* Ubicación */}
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
  );
};

export default ProductCard;
