import React from 'react'

type ConditionBadgeProps = {
    condition: string,
}

const ConditionBadge = ({condition}: ConditionBadgeProps) => {
  return (
    <div className='absolute top-0 left-6 bg-blue-500 text-white text-xs font-bold px-2 py-1'>
    <h3>{condition}</h3>
</div>
  )
}

export default ConditionBadge
