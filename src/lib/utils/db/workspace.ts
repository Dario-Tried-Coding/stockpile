import { db } from "@/lib/client/db"

export async function getWorkspaceById(id: string) {
  try {
    const workspace = await db.workspace.findUnique({
      where: { id },
    })
    return workspace
  } catch (error) {
    return null
  }
}

export async function getWorkspacesByUserId(userId: string) {
  try {
    const workspaces = await db.workspace.findMany({
      where: { users: { some: { id: userId } } },
    })
    return workspaces
  } catch (error) {
    return null
  }
}
