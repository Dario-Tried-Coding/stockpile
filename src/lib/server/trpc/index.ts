import { db } from '@/lib/client/db'
import { authRouter } from '@/lib/server/trpc/routers/auth-router'
import { privateProcedure, router } from './init'
import { adminRouter } from '@/lib/server/trpc/routers/admin-router'

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  getWorkspaces: privateProcedure.query(async ({ ctx: { userId } }) => {
    const workspaces = await db.workspace.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      }
    })

    return workspaces
  })
})

export type AppRouter = typeof appRouter
