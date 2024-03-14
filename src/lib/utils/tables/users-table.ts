import { db } from '@/lib/client/db'
import { User, Workarea, WorkspaceType } from '@prisma/client'
import { unset } from 'lodash'

// types
type UserInfo = Pick<User, 'id' | 'name' | 'email' | 'workspaceId'>
export interface AssignedUser extends UserInfo {
  workspaceId: string
  workspaceType: WorkspaceType
  workarea: Workarea
}
export interface WaitingUser extends UserInfo {
  workspaceId: null
  workspaceType: null
  workarea: null
}

// needed fields
const WORKSPACE_INFO = {
  id: true,
  name: true,
  workarea: true,
  type: true,
} as const
const USER_INFO = {
  id: true,
  name: true,
  email: true,
  workspaceId: true,
  workspace: {
    select: WORKSPACE_INFO,
  },
} as const

export const getTableUsers = async (userId: string) => {
  const users = await db.user.findMany({
    where: { NOT: { id: userId } },
    select: USER_INFO,
  })

  const assignedUsers = users
    .filter((u) => u.workspaceId !== null)
    .map((u) => {
      const massagedUser = { ...u, workspaceType: u.workspace!.type, workarea: u.workspace!.workarea }
      unset(massagedUser, 'workspace')
      return massagedUser as AssignedUser
    })

  const waitingUsers = users
    .filter((u) => u.workspaceId === null)
    .map((u) => {
      const massagedUser = { ...u, workspaceId: null, workspaceType: null, workarea: null }
      unset(massagedUser, 'workspace')
      return massagedUser as WaitingUser
    })

  return { assignedUsers, waitingUsers }
}

export async function getUsersTableData(userId: string) {
  const { assignedUsers, waitingUsers } = await getTableUsers(userId)
  const availableWorkspaces = await db.workspace.findMany({ select: WORKSPACE_INFO })

  return { assignedUsers, waitingUsers, availableWorkspaces }
}

export type UsersTableWorkspaceInfo = Awaited<ReturnType<typeof getUsersTableData>>['availableWorkspaces'][number]
export type UsersTableExtendedUser = AssignedUser | WaitingUser
