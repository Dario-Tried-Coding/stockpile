'use client'

import SelectCell from '@/components/table/SelectCell'
import ActionsCell from '@/components/table/users/ActionsCell'
import EditCell from '@/components/table/users/EditCell'
import { roleIcons } from '@/components/table/users/icons'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { useUsersTableContext } from '@/context/tables/UsersTableProvider'
import { getHotkeyHandler } from '@mantine/hooks'
import { User, Workarea, WorkspaceType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { startCase } from 'lodash'
import { ArrowUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const columns: ColumnDef<User>[] = [
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
    }
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
    accessorKey: 'workspaceId',
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
      return values.includes(workspaceId)
    },
    cell(cell) {
      const t = useTranslations('Pages.Users.Table.Client.Headers.Workspace.Placeholders')
      const { availableWorkspaces, eventHandlers, getters } = useUsersTableContext()

      const workspaceId = cell.getValue() as string | undefined

      const selectedOption = availableWorkspaces.find((w) => w.id === workspaceId)
      const options = availableWorkspaces.map((w) => ({ id: w.id, label: w.name }))

      const isInEditMode = getters.isInEditMode(cell.row.original.id)
      const isRowLoading = getters.isLoading(cell.row.original.id)

      return (
        <div className='flex items-center gap-2'>
          {!isInEditMode && selectedOption && <Badge variant='outline'>{selectedOption?.workarea}</Badge>}
          <SelectCell
            options={options}
            value={selectedOption ? { id: selectedOption.id, label: selectedOption.name } : null}
            onSelect={(value) => eventHandlers.onUserEdit(cell.row.original.id, value)}
            placeholders={{ select: t('select') }}
            editMode={isInEditMode}
            disabled={isRowLoading}
          />
        </div>
      )
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
      const { availableWorkspaces } = useUsersTableContext()
      return availableWorkspaces.find((w) => w.id === row.workspaceId)?.type
    },
    filterFn(row, id, values: string[]) {
      const role = row.getValue(id) as WorkspaceType | undefined
      return values.includes(role || '')
    },
    cell({ getValue }) {
      const role = getValue() as WorkspaceType | undefined
      const t = useTranslations('Index.Roles')

      const Icon = roleIcons.find((i) => i.id === role)?.icon
      return role && Icon ? (
        <span className='flex items-center gap-1'>
          <Icon className='w-4 h-4' />
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
      const id = props.row.original.id
      const {getters} = useUsersTableContext()

      const isInEditMode = getters.isInEditMode(id)

      return isInEditMode ? <EditCell {...props} /> : <ActionsCell {...props} />
    }
  },
]
