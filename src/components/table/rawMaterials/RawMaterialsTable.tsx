'use client'

import { TablePagination } from '@/components/table/TablePagination'
import { TableToolbar } from '@/components/table/rawMaterials/TableToolbar'
import { columns } from '@/components/table/rawMaterials/columns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { useRawMaterialsTable } from '@/hooks/tables/use-raw-materials-table'
import { cn } from '@/lib/utils'
import { Workarea } from '@prisma/client'
import { flexRender } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'

interface RawMaterialsTableProps extends HTMLAttributes<HTMLDivElement> {
  workarea: Workarea
}

const RawMaterialsTable: FC<RawMaterialsTableProps> = ({ workarea, className, ...rest }) => {
  const t = useTranslations('Pages.Dashboard.Production.Tables.RawMaterials.Client')
  const { table } = useRawMaterialsTable({ workarea })
  
  return (
    <div className={cn('', className)} {...rest}>
      <TableToolbar table={table} className='pb-4' />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((g) => (
              <TableRow key={g.id}>
                {g.headers.map((h) => (
                  <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((r) => (
                <TableRow key={r.id} data-state={r.getIsSelected() && 'selected'}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {t('empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} className='mt-4' />
    </div>
  )
}

export default RawMaterialsTable