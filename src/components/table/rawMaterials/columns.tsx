'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { ExtendedTableRawMaterial } from "@/lib/utils/tables/raw-materials-table"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ExtendedTableRawMaterial>[] = [
  {
    id: 'select',
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
    accessorKey: 'id',
  },
  {
    accessorKey: 'name',
  },
  {
    accessorKey: 'totalItems',
  },
  {
    accessorKey: 'unit',
  },
]