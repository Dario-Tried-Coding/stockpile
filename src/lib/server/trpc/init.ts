import { auth } from '@/lib/server/auth'
import { Context } from '@/lib/server/trpc/context'
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

const isAdmin = isAuth.unstable_pipe(opts => {
  const { user } = opts.ctx

  if (!user.isAdmin) throw new TRPCError({ code: 'UNAUTHORIZED', message: `Devi essere amministratore per eseguire questa azione.` })

  return opts.next()
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
export const adminProcedure = t.procedure.use(isAdmin)
