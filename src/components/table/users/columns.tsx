'use client'

import { Button } from '@/components/ui/Button'
import { ExtendedTableUser } from '@/lib/utils/tables/users-table'
import { Workarea } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { startCase } from 'lodash'
import EditCell from '@/components/table/users/EditCell'
import ComboboxCell from '@/components/table/ComboboxCell'
import { getUniqueValues } from '@/helpers'
import { useUsersTableContext } from '@/context/tables/UsersTableProvider'

export const columns: ColumnDef<ExtendedTableUser>[] = [
  {
    accessorKey: 'name',
    header({ column }) {
      const t = useTranslations('Pages.Users.Table.Headers')
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('name')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header({ column }) {
      const t = useTranslations('Pages.Users.Table.Headers')
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('email')}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'workspaces',
    header() {
      const t = useTranslations('Pages.Users.Table.Headers.Workspaces')
      return t('header')
    },
    accessorFn(row) {
      return row.workspaces.map((w) => w.id).join(', ')
    },
    cell(cell) {
      const t = useTranslations('Pages.Users.Table.Headers.Workspaces.Placeholders')
      const { availableWorkspaces, eventHandlers, getters } = useUsersTableContext()

      const selectedWorkspaceIdsString = cell.getValue() as string
      const selectedWorkspaceIds = selectedWorkspaceIdsString.split(', ').filter((id) => id.length > 0)

      const options = availableWorkspaces.map((w) => ({ id: w.id, label: w.name }))

      const isInEditMode = getters.isInEditMode(cell.row.original.id)
      const isLoading = getters.isLoading(cell.row.original.id)

      return (
        <ComboboxCell
          selectedIds={selectedWorkspaceIds}
          options={options}
          handleSelect={eventHandlers.onUserEdit}
          editMode={isInEditMode}
          disabled={isLoading}
          cell={cell}
          placeholders={{ cta: t('cta'), empty: t('empty'), search: t('search'), loading: t('loading') }}
        />
      )
    },
  },
  {
    accessorKey: 'workareas',
    header() {
      const t = useTranslations('Pages.Users.Table.Headers')
      return t('workareas')
    },
    accessorFn(row) {
      return getUniqueValues(row.workspaces.map((w) => w.workarea)).join(', ')
    },
    cell({ getValue }) {
      const workareasString = getValue() as string

      return startCase(workareasString.toLowerCase()) || '-'
    },
  },
  {
    accessorKey: 'roles',
    header() {
      const t = useTranslations('Pages.Users.Table.Headers')
      return t('roles')
    },
    accessorFn(row) {
      const t = useTranslations('Index.Roles')
      return getUniqueValues(row.workspaces.map((w) => t(w.type))).join(', ')
    },
    cell({ getValue }) {
      const rolesString = getValue() as string

      return startCase(rolesString.toLowerCase()) || '-'
    },
  },
  {
    id: 'edit',
    cell: EditCell,
  },
]
