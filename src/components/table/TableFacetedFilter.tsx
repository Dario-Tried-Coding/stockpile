import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/Command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import { Table } from '@tanstack/react-table'
import { capitalize } from 'lodash'
import { Check, PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

type TableFacetedFilterProps<TData> = {
  table: Table<TData>
  accessorKey: string
  title?: string
  options: {
    icon?: React.ComponentType<{ className?: string }>
    id: string
    label: string
  }[]
}

export function TableFacetedFilter<TData>({ table, title, accessorKey, options }: TableFacetedFilterProps<TData>) {
  const t = useTranslations('Pages.Users.Table.Client.Toolbar')
  const column = table.getColumn(accessorKey)

  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  if (!column) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircle className='mr-2 h-4 w-4' />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                    {t('FacetedFilters.multiple-selected', { count: selectedValues.size })}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.id))
                    .map((option) => (
                      <Badge variant='secondary' key={option.id} className='rounded-sm px-1 font-normal'>
                        {capitalize(option.label)}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t('FacetedFilters.no-results')}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.id)
                      } else {
                        selectedValues.add(option.id)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
                    <span className='capitalize'>{option.label.toLowerCase()}</span>
                    {facets && sumValuesFromMap(facets, option.id) && (
                      <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                        {sumValuesFromMap(facets, option.id)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => column?.setFilterValue(undefined)} className='justify-center text-center'>
                    {t('reset')}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function sumValuesFromMap(map: Map<string, number>, id: string) {
  let sum = 0
  for (const [key, value] of map.entries()) {
    const ids: string[] = key?.split(', ')
    if (ids?.includes(id)) {
      sum += value
    }
  }
  if (sum === 0) return undefined
  return sum
}
