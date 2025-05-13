import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import Image from 'next/image'
import { Circle } from 'lucide-react'
import ConditionBadge from './ConditionBadge'
import DiscountBadge from './DiscountBadge'
import StatusBadge from './StatusBadge'

type ProductCardProps = {
    description: string,
    image: string,
    price: string,
    discount?: string,
    condition: string,
    status: string,
}

const ProductCard = ({description, image, price, discount, condition, status, className}: ProductCardProps & {className?: string}) => {
    return (
      <Card className={`rounded-none flex flex-col h-full ${className}`}>
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
      </Card>
    )
  }

export default ProductCard
