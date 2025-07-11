import { Condition } from '@/types/modelTypes'
import React from 'react'

type Props = {
    data: Condition[]
    selections: number[]
    onChange: (id: number) => void;
}

const ConditionFilter = ({ data, selections, onChange }: Props) => {
  return (
    <div className=' border-t-1 border-gray-200 px-4 py-2'>
        <h3 className='text-lg'>Condition</h3>
      {data.map((condition) => (
        <div key={condition.id} className='flex flex-row gap-2 items-center'>
          <input 
            type="checkbox" 
            name={condition.name} 
            value={condition.id}
            onChange={() => onChange(condition.id)}
            checked={selections.includes(condition.id)}
            className='size-4' />
          <label className='font-medium'>{condition.description}</label>
        </div>
      ))}
    </div>
  )
}

export default ConditionFilter
