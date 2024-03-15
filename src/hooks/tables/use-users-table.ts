'use client'

import { columns } from '@/components/table/users/columns'
import { getUniqueValues } from '@/helpers'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { TGetUsersValidator } from '@/lib/common/validators/admin/users-table'
import { trpc } from '@/lib/server/trpc/trpc'
import { AssignedUser, UsersTableExtendedUser as ExtendedUser, UsersTableWorkspaceInfo, WaitingUser } from '@/lib/utils/tables/users-table'
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
import lodash from 'lodash'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UseUsersTableProps {
  userType: TGetUsersValidator['userType']
  initialUsers: ExtendedUser[]
  availableWorkspaces: UsersTableWorkspaceInfo[]
}

const UseUsersTable = ({ userType, initialUsers, availableWorkspaces }: UseUsersTableProps) => {
  const t = useTranslations('Pages.Users.Table.Client')
  const { tableClientErrorToast } = useCustomToasts()

  // data --------------------------------------------------------------------
  const [users, setUsers] = useState<ExtendedUser[]>(initialUsers)

  // query -------------------------------------------------------------------
  const { data } = trpc.admin.getUsers.useQuery({ userType }, { initialData: initialUsers as WaitingUser[] | AssignedUser[] })
  useEffect(() => setUsers(data), [data])

  // states ------------------------------------------------------------------
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    workarea: false,
  })

  const [inEditMode, setInEditMode] = useState<string[]>([])
  const [loading, setLoading] = useState<string[]>([])
  const [deleting, setDeleting] = useState<string[]>([])
  const [originalUsers, setOriginalUsers] = useState<ExtendedUser[]>([])
  const [inError, setInError] = useState<string[]>([])

  // available options --------------------------------------------------------
  const availableWorkareas = getUniqueValues(availableWorkspaces.map((w) => w.workarea))
  const availableRoles = getUniqueValues(availableWorkspaces.map((w) => w.type))

  // utils -------------------------------------------------------------------
  const getUser = (id: string) => {
    const user = users.find((u) => u.id === id)
    return user
  }
  const updateUser = (user: ExtendedUser) => {
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

  const putInDeletingState = (id: string) => setDeleting((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const removeFromDeletingState = (id: string) => setDeleting((prev) => prev.filter((_id) => _id !== id))

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

  const { mutate: deleteUserMtn } = trpc.admin.deleteUser.useMutation({
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
      putInDeletingState(id)
    },
    onSettled(_, __, { id }) {
      removeFromDeletingState(id)
    },
  })

  const { mutate: deleteUsersMtn } = trpc.admin.deleteUsers.useMutation({
    onSuccess({ ids, message }) {
      toast.success(message)
      ids.forEach((id) => deleteUserInstance(id))
      ids.forEach((id) => removeFromEditMode(id))
      utils.admin.getUsers.invalidate()
    },
    onError({ message }, { ids }) {
      ids.forEach((id) => putInErrorState(id))
      toast.error(message)
    },
    onMutate({ ids }) {
      ids.forEach((id) => removeFromErrorState(id))
      ids.forEach((id) => putInDeletingState(id))
    },
    onSettled(_, __, { ids }) {
      ids.forEach((id) => removeFromDeletingState(id))
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

  const deleteUser = (id: string, options?: { onSuccess?: () => void }) => deleteUserMtn({ id }, { onSuccess: options?.onSuccess })
  const deleteUsers = (ids: string[], options?: { onSuccess?: () => void }) => deleteUsersMtn({ ids }, { onSuccess: options?.onSuccess })

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
        return { ...u, workspaceId: selectedWorkspace.id, workspaceType: selectedWorkspace.type, workarea: selectedWorkspace.workarea }
      })
    )
  }

  // state checkers -----------------------------------------------------------
  const isInEditMode = (id: string) => inEditMode.includes(id)
  const isLoading = (id: string) => loading.includes(id)
  const isDeleting = (id: string) => deleting.includes(id)
  const isUserDirty = (id: string) => !lodash.isEqual(getUser(id), getUserInstance(id))
  const isInErrorState = (id: string) => inError.includes(id)

  // table -------------------------------------------------------------------
  const table = useReactTable({
    data: users,
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
    meta: {
      usersTable: {
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
          deleteUser,
          deleteUsers,
        },
        eventHandlers: {
          onUserEdit,
        },
        getters: {
          isInEditMode,
          isLoading,
          isDeleting,
          isUserDirty,
          isInErrorState,
        },
      },
    },
  })

  return { table, users }
}

export default UseUsersTable
