import { UnitIcons } from '@/components/icons/UnitIcons'
import { TableFacetedFilter } from '@/components/table/TableFacetedFilter'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { units } from '@/constants/units'
import { cn } from '@/lib/utils'
import { ExtendedTableRawMaterial as RawMaterial } from '@/lib/utils/tables/raw-materials-table'
import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HTMLAttributes } from 'react'

interface TableToolbarProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
}

export function TableToolbar<TData extends RawMaterial>({ table, className, ...rest }: TableToolbarProps<TData>) {
  const t = useTranslations('Pages.Dashboard.Production.Tables.RawMaterials')

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className={cn('flex flex-1 items-center gap-2', className)} {...rest}>
      <Input
        placeholder={t('Client.Toolbar.Input.placeholder')}
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        className='h-8 w-[150px] lg:w-[250px]'
      />
      <TableFacetedFilter table={table} accessorKey='unit' title={t('Client.Headers.unit')} options={units.map((unit) => ({ label: t(`Units.${unit}`), id: unit, icon: UnitIcons[unit] }))} />
      {isFiltered && (
        <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
          {t('Client.Toolbar.reset')}
          <X className='ml-2 h-4 w-4' />
        </Button>
      )}
    </div>
  )
}
