import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from 'react'

type SelectItemsProps = {
    label: string
    items: string[]
}

const SelectItems = ({ label, items }: SelectItemsProps) => {

  return (
    <Select>
      <SelectTrigger className="w-full border-2 h-10 border-gray-500 rounded-md">
        <SelectValue placeholder={label} className='text-start'/>
      </SelectTrigger>
      <SelectContent 
        position="popper" // 👈 Esto hace que el contenido se posicione debajo del trigger
        className="w-[var(--radix-select-trigger-width)] bg-white border border-gray-200 rounded-md shadow-lg z-50" // 👈 Estilos básicos
      >
        <SelectGroup>
          {items.map((item) => (
            <SelectItem value={item} key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectItems
