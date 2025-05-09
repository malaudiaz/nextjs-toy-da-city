import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import Image from 'next/image'
import { Button } from '../ui/button'
import {useTranslations} from 'next-intl';

const ProductCard = () => {
  const t = useTranslations('BestSellers');
  return (
    <Card className='w-[248px] h-[370px] rounded-none '>
        <CardHeader>
            <Image src={'/Group.png'} alt={'Toy'} width={216} height={188} />
        </CardHeader>
        <CardContent>
           <div className='flex flex-col gap-2'>
           <Button className='w-[97px] h-[25px] rounded-none bg-[#81B29A]'> Text</Button>
            <h2 className='text-[#81B29A] text-2xl'>{t('subtitle')}</h2>
            <p className='text-balance font-medium'>{t('description')}</p>
            <span className='text-[#e07a5f] font-bold'>$442.12</span>
           </div>
        </CardContent>
    </Card>
  )
}

export default ProductCard
