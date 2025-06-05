import React from 'react'
import Image from "next/image";
import { ProfileInfoProps } from './ProfileInfo';

const RegalosInfo = ({ produts }: ProfileInfoProps) => {
  return (
    <div className="w-full h-full  px-3 py-2 mt-4">
      <div className="bg-[#F0F5F0] flex flex-col gap-2 mt-2 rounded-md shadow-sm">
        {produts.map((product) => (
          <div
            key={product.data}
            className="flex flex-row gap-2 px-3 py-2 justify-between"
          >
            <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={product.image}
                alt={"Producto"}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center items-center">
              <p>{`${product.data}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RegalosInfo
