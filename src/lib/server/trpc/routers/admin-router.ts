import { getUniqueValues } from '@/helpers'
import { db } from '@/lib/client/db'
import { DeleteUserValidator, DeleteUsersValidator, GetUsersValidator, UpdateUserValidator } from '@/lib/common/validators/admin/users-table'
import { adminProcedure, router } from '@/lib/server/trpc/init'
import { getUserById } from '@/lib/utils/db/user'
import { getWorkspaceById } from '@/lib/utils/db/workspace'
import { getTableUsers } from '@/lib/utils/tables/users-table'
import { TRPCError } from '@trpc/server'
import { getTranslations } from 'next-intl/server'

export const adminRouter = router({
  getUsers: adminProcedure.input(GetUsersValidator).query(async ({ input: { userType }, ctx: { locale, userId } }) => {
    const { assignedUsers, waitingUsers } = await getTableUsers(userId!)
    return userType === 'assigned' ? assignedUsers : waitingUsers
  }),
  updateUser: adminProcedure.input(UpdateUserValidator).mutation(async ({ input: { id, workspaceId }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.Users.Table.Server' })

    const workspace = await getWorkspaceById(workspaceId)
    if (!workspace) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.workspace-not-found') })

    await db.user.update({
      where: { id },
      data: { workspaceId },
    })

    return { id, message: t('Success.user-updated') }
  }),
  deleteUser: adminProcedure.input(DeleteUserValidator).mutation(async ({ input: { id }, ctx: { locale, userId } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.Users.Table.Server' })

    const isHimself = id === userId
    if (isHimself) throw new TRPCError({ code: 'BAD_REQUEST', message: t('Errors.delete-self') })

    const user = await getUserById(id)
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.user-not-found', { id }) })

    await db.user.delete({ where: { id } })

    return { id, message: t('Success.user-deleted') }
  }),
  deleteUsers: adminProcedure.input(DeleteUsersValidator).mutation(async ({ input: { ids }, ctx: { locale, userId } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.Users.Table.Server' })

    const isInDeleteQueue = ids.includes(userId!)
    if (isInDeleteQueue) throw new TRPCError({ code: 'BAD_REQUEST', message: t('Errors.delete-self') })

    let sanitizedIds: string[] = []
    for (const id of ids) {
      const user = await getUserById(id)
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.user-not-found', { id }) })
      sanitizedIds.push(id)
    }

    await db.user.deleteMany({ where: { id: { in: sanitizedIds } } })

    return { ids: sanitizedIds, message: t('Success.users-deleted', { count: sanitizedIds.length }) }
  }),
})
