import { db } from '@/lib/client/db'

const WORKSPACE_INFO = {
  id: true,
  name: true,
  workarea: true,
  type: true,
} as const

export const getTableUsers = async () => {
  const users = await db.user.findMany({
    include: {
      workspaces: {
        select: WORKSPACE_INFO,
      },
    },
  })

  const assignedUsers = users.filter((u) => u.workspaces.length > 0)
  const waitingUsers = users.filter((u) => u.workspaces.length === 0)

  return { assignedUsers, waitingUsers }
}
export type ExtendedTableUser = Awaited<ReturnType<typeof getTableUsers>>['assignedUsers'][number]

export async function getUsersTableData() {
  const { assignedUsers, waitingUsers } = await getTableUsers()
  const availableWorkspaces = await db.workspace.findMany({ select: WORKSPACE_INFO })

  return { assignedUsers, waitingUsers, availableWorkspaces }
}
