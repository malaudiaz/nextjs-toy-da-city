import { Toy } from '@/types/toy'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getTranslations } from "next-intl/server";

type FeaturesProductProps = {
products: Toy[]
}

const FeaturesProduct = async ({products}: FeaturesProductProps) => {
  const t = await getTranslations("FeaturesProduct");
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/toys/${product.id}`}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <Image
                src={product.media[0]?.fileUrl || "/no-image.png"}
                alt={product.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                {product.price ? (
                  <p className="text-md text-green-700 font-bold">${product.price.toFixed(2)}</p>
                ) : (
                  <span className="bg-green-700 text-white px-1 py-1 rounded-lg font-bold shadow-sm w-1/4">{t("free")}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturesProduct
