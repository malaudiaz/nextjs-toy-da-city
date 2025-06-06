import FavoritesInfo from '@/components/shared/profile/FavoritesInfo'
import React from 'react'
import { products } from '../ventas/page'
import Breadcrumbs from '@/components/shared/BreadCrumbs'

const FavoritosPage = () => {
  return (
        <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] mt-5">
         <Breadcrumbs/>
        <h1 className="text-lg font-bold">Tus Favoritos</h1>
      </div>


        <FavoritesInfo produts={products} />
    </div>
  )
}

export default FavoritosPage
