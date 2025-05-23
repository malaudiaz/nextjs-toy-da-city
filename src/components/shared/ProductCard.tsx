import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Circle } from "lucide-react";
import ConditionBadge from "./ConditionBadge";
import DiscountBadge from "./DiscountBadge";
import StatusBadge from "./StatusBadge";

type ProductCardProps = {
  description: string;
  image: string;
  price: string;
  discount?: string;
  condition?: string;
  status: string;
};

const ProductCard = ({
  description,
  image,
  price,
  discount,
  condition,
  status,
}: ProductCardProps) => {
  return (
    <Card className="flex flex-col h-[300px] overflow-hidden py-0">
      <div className="w-full h-1/2 relative">
        {condition && (
          <ConditionBadge
            condition={condition}
            className="absolute top-3 left-4 z-10 bg-red-500 text-white px-2"
          />
        )}
        <Image
          src={image || "/placeholder.svg"}
          alt="product"
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex flex-col flex-grow px-3 h-1/2">
        <span className="text-md text-green-700 font-medium">${price}</span>
        <h1 className="text-lg font-semibold">
          {" "}
          {<StatusBadge status={status} />}
        </h1>
        <p className="line-clamp-2 min-h-[40px] mt-auto text-gray-600 my-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

{
  /* <Card className={`rounded-none flex flex-col h-full`}>
        <CardHeader className='relative min-h-[180px]'>
          <ConditionBadge condition={condition}/>
          {discount && <DiscountBadge discount={discount}/>}
          <Image 
            src={`${image}`} 
            alt='product' 
            width={200} 
            height={180}
            className="object-contain w-full h-full"
          />
        </CardHeader>
        
        <CardContent className='flex flex-col gap-2 flex-grow'>
            <StatusBadge status={status}/>
          <p className='line-clamp-2 min-h-[40px]'>{description}</p>
          <span className='text-sm text-green-700 mt-auto'>{price}</span>
        </CardContent>
      </Card> */
}
