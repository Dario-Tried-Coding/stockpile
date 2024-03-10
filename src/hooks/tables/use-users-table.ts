'use client'

import { columns } from '@/components/table/users/columns'
import { getUniqueValues } from '@/helpers'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { TGetUsersValidator } from '@/lib/common/validators/admin/users-table'
import { trpc } from '@/lib/server/trpc/trpc'
import { AssignedUser, UsersTableWorkspaceInfo, WaitingUser } from '@/lib/utils/tables/users-table'
import { User } from '@prisma/client'
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import lodash from 'lodash'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UseUsersTableProps {
  userType: TGetUsersValidator['userType']
  initialUsers: User[]
  availableWorkspaces: UsersTableWorkspaceInfo[]
}

const UseUsersTable = ({ userType, initialUsers, availableWorkspaces }: UseUsersTableProps) => {
  const t = useTranslations('Pages.Users.Table.Client')
  const { tableClientErrorToast } = useCustomToasts()

  // data --------------------------------------------------------------------
  const [users, setUsers] = useState<User[]>(initialUsers)

  // query -------------------------------------------------------------------
  const { data } = trpc.admin.getUsers.useQuery({ userType }, { initialData: initialUsers as WaitingUser[] | AssignedUser[] })
  useEffect(() => setUsers(data), [data])

  // states ------------------------------------------------------------------
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [inEditMode, setInEditMode] = useState<string[]>([])
  const [loading, setLoading] = useState<string[]>([])
  const [originalUsers, setOriginalUsers] = useState<User[]>([])
  const [inError, setInError] = useState<string[]>([])

  // available options --------------------------------------------------------
  const availableWorkareas = getUniqueValues(availableWorkspaces.map((w) => w.workarea))
  const availableRoles = getUniqueValues(availableWorkspaces.map((w) => w.type))

  // utils -------------------------------------------------------------------
  const getUser = (id: string) => {
    const user = users.find((u) => u.id === id)
    return user
  }
  const updateUser = (user: User) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)))
  }

  const getUserInstance = (id: string) => {
    const user = originalUsers.find((u) => u.id === id)
    return user
  }
  const storeUserInstance = (id: string) => {
    const user = users.find((u) => u.id === id)

    if (!user) {
      tableClientErrorToast(t('Errors.User.edit-not-found'))
      return
    }

    setOriginalUsers((prev) => (prev.some((u) => u.id === id) ? prev : [...prev, user]))
  }
  const deleteUserInstance = (id: string) => {
    const user = getUserInstance(id)
    if (!user) return
    setOriginalUsers((prev) => prev.filter((u) => u.id !== id))
    return user
  }

  const putInEditMode = (id: string) => setInEditMode((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const removeFromEditMode = (id: string) => setInEditMode((prev) => prev.filter((_id) => _id !== id))

  const putInLoadingState = (id: string) => setLoading((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const removeFromLoadingState = (id: string) => setLoading((prev) => prev.filter((_id) => _id !== id))

  const putInErrorState = (id: string) => setInError((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const removeFromErrorState = (id: string) => setInError((prev) => prev.filter((_id) => _id !== id))

  // mutation ----------------------------------------------------------------
  const utils = trpc.useUtils()

  const { mutate: saveMod } = trpc.admin.updateUser.useMutation({
    onSuccess({ id, message }) {
      toast.success(message)
      deleteUserInstance(id)
      removeFromEditMode(id)
      utils.admin.getUsers.invalidate()
    },
    onError({ message }, { id }) {
      putInErrorState(id)
      toast.error(message)
    },
    onMutate({ id }) {
      removeFromErrorState(id)
      putInLoadingState(id)
    },
    onSettled(_, __, { id }) {
      removeFromLoadingState(id)
    },
  })

  // actions -----------------------------------------------------------------
  const revertUser = (id: string) => {
    const userInstance = deleteUserInstance(id)
    if (!userInstance) {
      tableClientErrorToast(t('Errors.User.edit-not-found'))
      return
    }

    updateUser(userInstance)
    removeFromErrorState(id)
    removeFromEditMode(id)
  }

  const saveUser = (id: string) => {
    const user = users.find((u) => u.id === id)

    if (!user) {
      tableClientErrorToast(t('Errors.User.save-not-found'))
      return
    }

    if (!user.workspaceId) {
      tableClientErrorToast(t('Errors.User.save-without-workspace'))
    }

    saveMod({ id: user.id, workspaceId: user.workspaceId as AssignedUser['workspaceId'] })
  }

  const editUser = (id: string) => {
    removeFromErrorState(id)
    storeUserInstance(id)
    putInEditMode(id)
  }

  // events ------------------------------------------------------------------
  const onUserEdit = (id: string, workspaceId: string) => {
    const selectedWorkspace = availableWorkspaces.find((w) => w.id === workspaceId)
    
    if (!selectedWorkspace) {
      tableClientErrorToast(t('Errors.Workspace.edit-not-found'))
      return
    }

    setUsers((prev) =>
      prev.map((u) => {
        const isRightUser = u.id === id

        if (!isRightUser) return u
        return { ...u, workspaceId }
      })
    )
  }

  // state checkers -----------------------------------------------------------
  const isInEditMode = (id: string) => inEditMode.includes(id)
  const isLoading = (id: string) => loading.includes(id)
  const isUserDirty = (id: string) => !lodash.isEqual(getUser(id), getUserInstance(id))
  const isInErrorState = (id: string) => inError.includes(id)

  // table -------------------------------------------------------------------
  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return {
    table,
    users,
    context: {
      availableWorkspaces,
      availableWorkareas,
      availableRoles,
      setters: {
        editMode: {
          putInEditMode,
          removeFromEditMode,
        },
      },
      actions: {
        revertUser,
        saveUser,
        editUser,
      },
      eventHandlers: {
        onUserEdit,
      },
      getters: {
        isInEditMode,
        isLoading,
        isUserDirty,
        isInErrorState,
      },
    },
  }
}

export default UseUsersTable
