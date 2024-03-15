import { RowData } from '@tanstack/table-core'

import { UsersTableWorkspaceInfo } from '@/lib/utils/tables/users-table'
import { Workarea, WorkspaceType } from '@prisma/client'

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    usersTable: {
      availableWorkspaces: UsersTableWorkspaceInfo[]
      availableWorkareas: Workarea[]
      availableRoles: WorkspaceType[]
      setters: {
        editMode: {
          putInEditMode: (id: string) => void
          removeFromEditMode: (id: string) => void
        }
      }
      actions: {
        revertUser: (id: string) => void
        saveUser: (id: string) => void
        editUser: (id: string) => void
        deleteUser: (
          id: string,
          options?: {
            onSuccess?: () => void
          }
        ) => void
        deleteUsers: (
          ids: string[],
          options?: {
            onSuccess?: () => void
          }
        ) => void
      }
      eventHandlers: {
        onUserEdit: (id: string, workspaceId: string) => void
      }
      getters: {
        isInEditMode: (id: string) => boolean
        isLoading: (id: string) => boolean
        isDeleting: (id: string) => boolean
        isUserDirty: (id: string) => boolean
        isInErrorState: (id: string) => boolean
      }
    }
  }
}
