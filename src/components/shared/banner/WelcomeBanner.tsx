import Image from 'next/image'
import React from 'react'

const WelcomeBanner = () => {
  return (
    <div className="relative md:hidden">
    <Image
      src={"/homescreen.jpg"}
      alt={"banner"}
      height={250}
      width={574}
      className="object-cover w-full h-auto" // Mejor manejo de responsividad
      priority // Para imágenes importantes
    />
    <div className="absolute top-1/4 left-0 px-4 w-full max-w-[574px] space-y-3">
      <div>
        <p className="text-white text-xl md:text-3xl font-bold mb-1">
          Welcome to
        </p>
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-2 leading-tight">
          Toydacity
        </h1>
      </div>
      <h2 className="text-white text-4xl md:text-3xl font-bold w-3/4 leading-snug">
        Sustainable
        <br />
        Toy Marketplace
      </h2>
    </div>
  </div>
  )
}

export default WelcomeBanner
