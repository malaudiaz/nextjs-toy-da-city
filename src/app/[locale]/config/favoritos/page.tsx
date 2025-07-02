import FavoritesInfo from '@/components/shared/profile/FavoritesInfo'
import React from 'react'
import Breadcrumbs from '@/components/shared/BreadCrumbs'

const products = [
  {
    image: "/image 4.png",
    price: 200,
    data: "Sale from 2023-01-01",
    name: "Car",
    owner: "Miguel",
  },
  {
    image: "/image 4.png",
    price: 250,
    data: "Sale from 2023-02-01",
    name: "Buzz Lightyear",
    owner: "Rodolfo",
  },
];

const FavoritosPage = () => {
  return (
        <div className="w-full h-full bg-[#fbfaf4]">
      <div className="px-5 py-2 bg-[#F0F5F0] mt-5">
         <Breadcrumbs/>
        <h1 className="text-lg font-bold">Your Favorites</h1>
      </div>


        <FavoritesInfo produts={products} />
    </div>
  )
}

export default FavoritosPage
