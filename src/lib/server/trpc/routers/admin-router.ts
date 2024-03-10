import { getUniqueValues } from '@/helpers'
import { db } from '@/lib/client/db'
import { GetUsersValidator, UpdateUserValidator } from '@/lib/common/validators/admin/users-table'
import { adminProcedure, router } from '@/lib/server/trpc/init'
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
})
