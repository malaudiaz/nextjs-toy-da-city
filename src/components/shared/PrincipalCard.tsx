import { Circle, Eye, Heart, ShoppingCart } from 'lucide-react'
import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'

const PrincipalCard = () => {
  return (
    <Card className='rounded-none h-full'>
        <CardHeader className="relative flex items-center justify-center h-[268px]">
  {/* Etiqueta Barter - Esquina superior izquierda */}
  <div className="absolute top-5 left-9 bg-blue-500 text-white text-xs font-bold px-2 py-1 z-10">
    <h3>Barter</h3>
  </div>

  {/* Etiqueta 25% OFF - Esquina superior derecha */}
  <div className="absolute top-5 right-6 bg-white text-red-500 text-xs font-bold px-2 py-1 z-10">
    <h3>25% OFF</h3>
  </div>

  {/* Imagen centrada */}
  <Image
    src="/princess.png"
    alt="princess"
    width={280}
    height={268}
    className="object-cover max-h-full max-w-full"
  />
</CardHeader>
        <CardContent className='flex flex-col justify-center gap-2 mt-auto'>
            <p>★★★★★</p>
            <span className='line-clamp-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, ...</span>
            <h3 className='text-lg'>800</h3>
            <p className='line-clamp-3 text-balance'>Games built using the Xbox Series X|S development kit showcase unparalleled load times, visuals.</p>
        </CardContent>
        <CardFooter className='flex justify-around items-center gap-2 mt-auto w-full'> 
            <Button className='rounded-none  p-3  size-12'><Heart/></Button>
            <Button className='rounded-none flex-1 h-full px-4 py-3 text-sm font-medium text-white'><ShoppingCart/>ADD TO CART</Button>
            <Button className='rounded-none   p-3  size-12'><Eye/></Button>
        </CardFooter>
    </Card>
  )
}

export default PrincipalCard
