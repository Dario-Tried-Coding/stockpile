'use client'

import { columns } from '@/components/table/rawMaterials/columns'
import { trpc } from '@/lib/server/trpc/trpc'
import { ExtendedTableRawMaterial as RawMaterial } from '@/lib/utils/tables/raw-materials-table'
import { Workarea } from '@prisma/client'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

type UseRawMaterialsTableProps = {
  workarea: Workarea
}

export const useRawMaterialsTable = ({ workarea }: UseRawMaterialsTableProps) => {
  // data --------------------------------------------------------------------
  const [rows, setRows] = useState<RawMaterial[]>([])

  // query -------------------------------------------------------------------
  const { data } = trpc.production.getRawMaterialsTable.useQuery({ workarea })
  useEffect(() => {
    if (data) setRows(data)
  }, [data])

  // states -----------------------------------------------------------------
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // table ------------------------------------------------------------------
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return { table, rows }
}
