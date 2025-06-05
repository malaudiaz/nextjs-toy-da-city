import FavoritesInfo from '@/components/shared/profile/FavoritesInfo'
import React from 'react'
import { products } from '../ventas/page'

const FavoritosPage = () => {
  return (
        <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-10 py-2 bg-[#F0F5F0] mt-5">
        <h1 className="text-lg font-bold">Tus Compras</h1>
      </div>


        <FavoritesInfo produts={products} />
    </div>
  )
}

export default FavoritosPage
