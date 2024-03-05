'use client'

import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { cn } from '@/lib/utils'
import { CellContext } from '@tanstack/react-table'
import { Check, ChevronsUpDown } from 'lucide-react'
import { FC, useState } from 'react'

export type ComboboxCellOption = {
  id: string
  label: string
}

interface ComboboxCellProps<T extends { id: string }> {
  selectedIds: string[]
  cell: CellContext<T, unknown>
  options: ComboboxCellOption[]
  handleSelect: (id: string, currentId: string) => void
  editMode: boolean
  disabled: boolean
  placeholders: {
    cta: string
    search: string
    empty: string
    loading: string
  }
}

const ComboboxCell: FC<ComboboxCellProps<any>> = ({ cell, options, handleSelect, selectedIds, editMode, disabled, placeholders: { cta, search, empty, loading } }) => {
  const [open, setOpen] = useState(false)

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id))

  const rowId = cell.row.original.id

  // render -------------------------------------------------------------------
  if (!editMode) return <span>{selectedOptions.map((opt) => opt.label).join(', ') || '-'}</span>

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-[200px] justify-between font-normal lg:w-[400px]'>
          <span className='truncate'>{selectedOptions?.map((opt) => opt.label).join(', ') || cta}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0 lg:w-[400px]'>
        <Command>
          <CommandInput placeholder={search} disabled={!options} />
          <CommandEmpty>{empty}</CommandEmpty>
          <CommandGroup>
            {options ? (
              options.length !== 0 ? (
                options.map((opt) => {
                  // console.log('opt: ', opt.label)
                  return (
                  <CommandItem
                    key={opt.id}
                    value={opt.id}
                    onSelect={(currentId) => handleSelect(rowId, currentId)}
                  >
                    {opt.label}
                    <Check className={cn('ml-auto h-4 w-4', selectedIds.includes(opt.id) ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                )})
              ) : (
                <span>{empty}</span>
              )
            ) : (
              <span>{loading}</span>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboboxCell
