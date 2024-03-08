'use client'

import { TablePagination } from '@/components/table/TablePagination'
import { TableToolbar } from '@/components/table/users/TableToolbar'
import { columns } from '@/components/table/users/columns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { UsersTableProvider } from '@/context/tables/UsersTableProvider'
import UseUsersTable from '@/hooks/tables/use-users-table'
import { TGetUsersValidator } from '@/lib/common/validators/admin/users-table'
import { cn } from '@/lib/utils'
import { ExtendedTableUser } from '@/lib/utils/tables/users-table'
import { Workspace } from '@prisma/client'
import { flexRender } from '@tanstack/react-table'
import { FC, HTMLAttributes } from 'react'

interface UsersTableProps extends HTMLAttributes<HTMLDivElement> {
  initialUsers: ExtendedTableUser[]
  userType: TGetUsersValidator['userType']
  availableWorkspaces: ExtendedTableUser['workspaces']
}

const UsersTable: FC<UsersTableProps> = ({ initialUsers, userType, availableWorkspaces, className, ...rest }) => {
  const {table, users, context} = UseUsersTable({ initialUsers, userType, availableWorkspaces })

  return (
    <UsersTableProvider context={context}>
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
                    Nessun risultato.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} className='mt-4' />
      </div>
    </UsersTableProvider>
  )
}

export default UsersTable