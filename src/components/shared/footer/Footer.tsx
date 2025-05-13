import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-full h-full mt-20 bg-[#24272A]'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  py-10'>
        <Image src={'/Logo2.png'} alt={'Toy'} width={118} height={23} />
      </div>
    </div>
  )
}

export default Footer
