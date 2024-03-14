'use client'

import { TablePagination } from '@/components/table/TablePagination'
import { TableToolbar } from '@/components/table/users/TableToolbar'
import { columns } from '@/components/table/users/columns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import UseUsersTable from '@/hooks/tables/use-users-table'
import { TGetUsersValidator } from '@/lib/common/validators/admin/users-table'
import { cn } from '@/lib/utils'
import { AssignedUser, UsersTableWorkspaceInfo, WaitingUser } from '@/lib/utils/tables/users-table'
import { flexRender } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'

interface UsersTableProps extends HTMLAttributes<HTMLDivElement> {
  initialUsers: AssignedUser[] | WaitingUser[]
  userType: TGetUsersValidator['userType']
  availableWorkspaces: UsersTableWorkspaceInfo[]
}

const UsersTable: FC<UsersTableProps> = ({ initialUsers, userType, availableWorkspaces, className, ...rest }) => {
  const t = useTranslations('Pages.Users.Table.Client')
  const { table, users } = UseUsersTable({ initialUsers, userType, availableWorkspaces })

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
                  {t('Placeholders.empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} className='mt-4' />
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre> */}
    </div>
  )
}

export default UsersTable
