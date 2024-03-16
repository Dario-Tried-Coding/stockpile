'use client'

import SelectCell from '@/components/table/SelectCell'
import ActionsCell from '@/components/table/users/ActionsCell'
import { workspaceIcons as roleIcons } from '@/components/icons/WorkspaceIcons'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { UsersTableExtendedUser as ExtendedUser } from '@/lib/utils/tables/users-table'
import { WorkspaceType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { startCase, capitalize } from 'lodash'
import { ArrowUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const columns: ColumnDef<ExtendedUser>[] = [
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
      const t = useTranslations('Pages.Users.Table.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('name')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header({ column }) {
      const t = useTranslations('Pages.Users.Table.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('email')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'workspace',
    accessorFn(row) {
      return row.workspaceId
    },
    header({ column }) {
      const t = useTranslations('Pages.Users.Table.Client.Headers.Workspace')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('header')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    filterFn(row, id, values: string[]) {
      const workspaceId = row.getValue(id) as string
      const workarea = row.original.workarea
      return values.includes(workspaceId) || values.includes(workarea || '')
    },
    cell(cell) {
      const t = useTranslations('Pages.Users.Table.Client.Headers.Workspace.Placeholders')
      const tableCtx = cell.table.options.meta?.usersTable

      const workspaceId = cell.getValue() as string | undefined

      const selectedOption = tableCtx?.availableWorkspaces.find((w) => w.id === workspaceId)
      const options = tableCtx?.availableWorkspaces.map((w) => ({ id: w.id, label: w.name })) || []

      const isInEditMode = !!tableCtx?.getters.isInEditMode(cell.row.original.id)
      const isRowLoading = tableCtx?.getters.isLoading(cell.row.original.id)

      return (
        <div className='flex items-center gap-2'>
          {!isInEditMode && selectedOption && <Badge variant='outline'>{selectedOption?.workarea}</Badge>}
          <SelectCell
            options={options}
            value={selectedOption ? { id: selectedOption.id, label: selectedOption.name } : null}
            onSelect={(value) => tableCtx?.eventHandlers.onUserEdit(cell.row.original.id, value)}
            placeholders={{ select: t('select') }}
            editMode={isInEditMode}
            disabled={isRowLoading}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'workarea',
    header({ column }) {
      const t = useTranslations('Pages.Users.Table.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('workarea')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    filterFn(row, id, values: string[]) {
      const workarea = row.getValue(id) as string | null
      return values.includes(workarea || '')
    },
    cell({ getValue }) {
      const workarea = getValue() as string | null
      return capitalize(workarea || '-')
    },
  },
  {
    accessorKey: 'role',
    header({ column }) {
      const t = useTranslations('Pages.Users.Table.Client.Headers')
      return (
        <Button variant='ghost' className='-ml-4' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('role')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    accessorFn(row) {
      return row.workspaceType
    },
    filterFn(row, id, values: string[]) {
      const role = row.getValue(id) as WorkspaceType | null
      return values.includes(role || '')
    },
    cell({ getValue }) {
      const role = getValue() as WorkspaceType | null
      const t = useTranslations('Index.Roles')

      const Icon = roleIcons.find((i) => i.id === role)?.icon
      return role && Icon ? (
        <span className='flex items-center gap-1'>
          <Icon className='h-4 w-4' />
          {startCase(t(role).toLowerCase())}
        </span>
      ) : (
        '-'
      )
    },
  },
  {
    id: 'edit',
    cell(props) {
      return <ActionsCell {...props} />
    },
  },
]
