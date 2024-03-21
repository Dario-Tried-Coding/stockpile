import { auth } from '@/lib/server/auth'
import { Context } from '@/lib/server/trpc/context'
import { getWorkspaceById } from '@/lib/utils/db/workspace'
import { WorkspaceType as Role } from '@prisma/client'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const session = await auth()

  if (!session || !session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: `Devi aver eseguito l\'accesso.` })
  }

  return opts.next({
    ctx: {
      userId: session.user.id,
      user: session.user,
    },
  })
})

const isAdmin = isAuth.unstable_pipe((opts) => {
  const { user } = opts.ctx

  if (!user.isAdmin) throw new TRPCError({ code: 'UNAUTHORIZED', message: `Devi essere amministratore per eseguire questa azione.` })

  return opts.next()
})

type Opts = {
  canAdmin: boolean
}
const isRole = (role: Role, opts: Opts = { canAdmin: true }) =>
  isAuth.unstable_pipe(async (TRPC_Opts) => {
    const { user } = TRPC_Opts.ctx

    const workspace = await getWorkspaceById(user.workspaceId || '')

    if (workspace?.type !== role) {
      if (user.isAdmin) {
        if (!opts.canAdmin) throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Pur avendo diritti di amministratore non puoi eseguire questa azione.',
        })
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Devi lavorare in uno dei ${role === 'SHOP' ? 'negozi' : 'centri'} per eseguire questa azione.`,
        })
      }
    }

    return TRPC_Opts.next()
  })

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
export const adminProcedure = t.procedure.use(isAdmin)
export const roleBasedProcedure = (role: Role, opts?: Opts) => t.procedure.use(isRole(role, opts))
