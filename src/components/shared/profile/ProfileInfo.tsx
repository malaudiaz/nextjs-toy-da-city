import Image from "next/image";
import React from "react";

export type Product = {
  image: string;
  price: number;
  data: string;
  name?: string;
  owner?: string;
};

export type ProfileInfoProps = {
  title?: string;
  secondaryTitle?: string;
  produts: Product[];
  hideSecondaryTitle?: boolean;
};

const ProfileInfo = ({ title, secondaryTitle, produts, hideSecondaryTitle}: ProfileInfoProps) => {
  return (
    <>
      {title && (
        <div className="w-full h-full  px-5 py-2 ">
          <h1 className="font-bold text-lg">{title}</h1>

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
                  <p>{`${product.price} €`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {secondaryTitle && (
        <div className="px-5 py-2">
          {hideSecondaryTitle ? null : <h1 className="font-bold text-lg">{secondaryTitle}</h1>}
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
                  {product.data}
                </div>
                <div className="flex justify-center items-center">
                  <p>{`${product.price} €`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileInfo;
