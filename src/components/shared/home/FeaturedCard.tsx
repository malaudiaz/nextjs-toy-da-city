import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const FeaturedCard = () => {
  return (
<Card className="h-full flex flex-col rounded-none">
  <CardHeader className="h-[180px] min-h-[180px] flex items-center justify-center  bg-gray-50"> 
    <Image 
      src="/image 4.png" 
      alt="Toy" 
      width={250} 
      height={180} 
      className="object-contain w-full h-full"
    />
  </CardHeader>
  
  {/* Sección de contenido - Ocupa el 40% restante */}
  <CardContent className="flex-[1] p-4 pt-2 justify-start gap-1">
    <div>
      <div className="flex gap-1 text-yellow-400 text-xs mb-1">★★★★★</div>
      <p className="line-clamp-2 text-xs text-gray-700 leading-snug">
        Lorem ipsum dolor sit amet consectetur
      </p>
    </div>
    <span className="font-bold text-sm">$70</span>
  </CardContent>
</Card>
  )
}

export default FeaturedCard
