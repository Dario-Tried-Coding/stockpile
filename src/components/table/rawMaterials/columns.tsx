'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { RawMaterial } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<RawMaterial>[] = [
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
    accessorKey: 'unit',
  },
]