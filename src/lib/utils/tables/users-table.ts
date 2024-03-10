import { db } from '@/lib/client/db'
import { User } from '@prisma/client'

export interface AssignedUser extends User { workspaceId: string }
export interface WaitingUser extends User { workspaceId: null }

const WORKSPACE_INFO = {
  id: true,
  name: true,
  workarea: true,
  type: true,
} as const

export const getTableUsers = async (userId: string) => {
  const users = await db.user.findMany({
    where: { NOT: { id: userId } },
  })

  const assignedUsers = users.filter((u) => u.workspaceId !== null) as AssignedUser[]
  const waitingUsers = users.filter((u) => u.workspaceId === null) as WaitingUser[]

  return { assignedUsers, waitingUsers }
}

export async function getUsersTableData(userId: string) {
  const { assignedUsers, waitingUsers } = await getTableUsers(userId)
  const availableWorkspaces = await db.workspace.findMany({ select: WORKSPACE_INFO })

  return { assignedUsers, waitingUsers, availableWorkspaces }
}

export type UsersTableWorkspaceInfo = Awaited<ReturnType<typeof getUsersTableData>>['availableWorkspaces'][number]