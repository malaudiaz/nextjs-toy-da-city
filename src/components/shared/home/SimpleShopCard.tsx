import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const SimpleShopCard = () => {
  return (
    <div className='bg-[#E8ECF1] w-[464px] h-[312px]'>
      <div className='px-8 py-10 flex items-center justify-center gap-2'>
        <Image src={'/image 4.png'} alt={'Toy'} width={200} height={232} />
        <div className='flex flex-col gap-2 w-[200px] h-[232px]'>
            <h3 className='text-2xl font-bold line-clamp-4 text-balance'>Vintage Toy Car Metal Model Cars Toys For Kids</h3>
            <span className='text-green-700'>€ 299</span>
            <Button className='bg-[#E07A5F] hover:bg-[#bb664f] text-white w-full py-6 flex items-center gap-2 rounded-none mt-auto'> SHOP NOW</Button>
        </div>
      </div>
    </div>
  )
}

export default SimpleShopCard
