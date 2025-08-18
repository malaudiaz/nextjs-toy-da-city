import { Toy } from '@/types/toy'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type FeaturesProductProps = {
products: Toy[]
}

const FeaturesProduct = async ({products}: FeaturesProductProps) => {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <Image
                src={product.media[0]?.fileUrl || "/no-image.png"}
                alt={product.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturesProduct
