import { TableFacetedFilter } from '@/components/table/TableFacetedFilter'
import TableViewOptions from '@/components/table/TableViewOptions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HTMLAttributes } from 'react'

interface TableToolbarProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
}

export function TableToolbar<TData>({ table, className, ...rest }: TableToolbarProps<TData>) {
  const roles_t = useTranslations('Index.Roles')
  const toolbar_t = useTranslations('Pages.Users.Table.Client.Toolbar')
  const headers_t = useTranslations('Pages.Users.Table.Client.Headers')

  const tableCtx = table.options.meta?.usersTable

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className={cn('flex flex-1 items-center gap-2', className)} {...rest}>
      <Input
        placeholder={toolbar_t('search')}
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        className='h-8 w-[150px] lg:w-[250px]'
      />
      <TableFacetedFilter
        table={table}
        accessorKey='workspace'
        title={headers_t('Workspace.header')}
        options={tableCtx?.availableWorkspaces.map((w) => ({ label: w.name, id: w.id })) || []}
      />
      <TableFacetedFilter
        table={table}
        accessorKey='workarea'
        title={headers_t('workarea')}
        options={tableCtx?.availableWorkareas.map((w) => ({ label: w, id: w })) || []}
      />
      <TableFacetedFilter
        table={table}
        accessorKey='role'
        title={headers_t('role')}
        options={tableCtx?.availableRoles.map((r) => ({ label: roles_t(r), id: r })) || []}
      />
      {isFiltered && (
        <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
          {toolbar_t('reset')}
          <XIcon className='ml-2 h-4 w-4' />
        </Button>
      )}
      <div className='ml-auto'>
        <TableViewOptions table={table} />
      </div>
    </div>
  )
}
