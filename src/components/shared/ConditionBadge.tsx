import React from 'react'

type ConditionBadgeProps = {
    condition: string,
    className?: string
}

const ConditionBadge = ({condition, className}: ConditionBadgeProps) => {
  return (
    <div className={`${className}`}>
    <h3>{condition}</h3>
</div>
  )
}

export default ConditionBadge
