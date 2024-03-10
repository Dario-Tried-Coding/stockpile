import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { FC } from 'react'

export type SelectCellOption = {
  id: string
  label: string
}

interface SelectCellProps {
  placeholders: {
    select: string
  }
  options: SelectCellOption[]
  value?: SelectCellOption | null
  onSelect: (value: string) => void
  editMode: boolean
  disabled?: boolean
}

const SelectCell: FC<SelectCellProps> = ({ placeholders: { select }, options, value, onSelect, editMode }) => {
  if (!editMode) return value?.label || '-'

  return (
    <Select value={value?.id} onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder={select} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectCell
