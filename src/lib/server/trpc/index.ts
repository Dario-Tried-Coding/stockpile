import { db } from '@/lib/client/db'
import { authRouter } from '@/lib/server/trpc/routers/auth-router'
import { privateProcedure, router } from './init'
import { adminRouter } from '@/lib/server/trpc/routers/admin-router'
import { auth } from '@/lib/server/auth'

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  getWorkspaces: privateProcedure.query(async ({ ctx: { userId } }) => {
    const session = await auth()

    const queryOpts = session?.user?.isAdmin
      ? undefined
      : ({
          where: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        } as const)

    const workspaces = await db.workspace.findMany(queryOpts)

    return workspaces
  }),
})

export type AppRouter = typeof appRouter
