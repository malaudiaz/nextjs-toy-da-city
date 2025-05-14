import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const categories = [
    {
      id: 1,
      name: "Computer & Laptop",
      image: "/Category1.png",
      href: "/Category1.png",
    },
    {
        id: 2,
        name: "Computer & Laptop",
        image: "/Category1.png",
        href: "/Category1.png",
      },
      {
        id: 3,
        name: "Computer & Laptop",
        image: "/Category1.png",
        href: "/Category1.png",
      },
      {
        id: 4,
        name: "Computer & Laptop",
        image: "/Category1.png",
        href: "/Category1.png",
      },
      {
        id: 5,
        name: "Computer & Laptop",
        image: "/Category1.png",
        href: "/Category1.png",
      },
      {
        id: 6,
        name: "Computer & Laptop",
        image: "/Category1.png",
        href: "/Category1.png",
      },
      {
        id: 7,
        name: "Computer & Laptop",
        image: "/Category1.png",
        href: "/Category1.png",
      },
  ]

const CategoryCarousel = () => {
  return (
    <div className="relative w-full mx-auto max-w-7xl px-4 mt-20">
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Shop with Categorys</h2>
    </div>

    <div className="relative">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className='px-1'>
          {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/6">
              <Link href={category.href}>
                <Card className="overflow-hidden border rounded-md hover:shadow-md transition-shadow duration-300 ">
                  <div className="p-2">
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center py-3">
                      <h3 className="text-sm font-medium">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-rose-400 hover:bg-rose-500 text-white rounded-full p-3 shadow-md z-10 border-none" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-rose-400 hover:bg-rose-500 text-white rounded-full p-3 shadow-md z-10 border-none" />
      </Carousel>
    </div>
  </div>
  )
}

export default CategoryCarousel
