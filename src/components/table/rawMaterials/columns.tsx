'use client'

import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/checkbox"
import { ExtendedTableRawMaterial } from "@/lib/utils/tables/raw-materials-table"
import { Unit } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { capitalize } from "lodash"
import { UnitIcons } from "@/components/icons/UnitIcons"
import { Badge } from "@/components/ui/Badge"

export const columns: ColumnDef<ExtendedTableRawMaterial>[] = [
  {
    id: 'select',
    header({ table }) {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      )
    },
    cell({ row }) {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      )
    },
  },
  {
    accessorKey: 'name',
    header({ column }) {
      const t = useTranslations('Pages.Dashboard.Production.Tables.RawMaterials.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('name')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell(cell) {
      const amount = cell.row.original.totalItems
      const name = cell.getValue() as string
      return (
        <span>
          <Badge variant='outline' >{amount}</Badge> {capitalize(name)}
        </span>
      )
    },
  },
  {
    accessorKey: 'quantity',
    header({ column }) {
      const t = useTranslations('Pages.Dashboard.Production.Tables.RawMaterials.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('quantity')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'unit',
    filterFn(row, id, values: Unit[]) {
      const unit = row.getValue(id) as Unit
      return values.includes(unit)
    },
    header({ column }) {
      const t = useTranslations('Pages.Dashboard.Production.Tables.RawMaterials.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('unit')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell(cell) {
      const t = useTranslations('Pages.Dashboard.Production.Tables.RawMaterials.Units')
      
      const unit = cell.getValue() as Unit
      const UnitIcon = UnitIcons[unit]

      return <span className="flex items-center gap-1"><UnitIcon className="h-4 w-4" /> {capitalize(t(unit))}</span>
    },
  },
]