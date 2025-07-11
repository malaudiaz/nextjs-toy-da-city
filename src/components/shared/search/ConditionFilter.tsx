import { Condition } from '@/types/modelTypes'
import React from 'react'

type Props = {
    data: Condition[]
}

const ConditionFilter = ({ data }: Props) => {
  return (
    <div className=' border-t-1 border-gray-200 px-4 py-2'>
        <h3 className='text-lg'>Condition</h3>
      {data.map((condition) => (
        <div key={condition.id} className='flex flex-row gap-2 items-center'>
          <input type="checkbox" name={condition.description} value={condition.id} className='size-4' />
          <label className='font-medium'>{condition.description}</label>
        </div>
      ))}
    </div>
  )
}

export default ConditionFilter
