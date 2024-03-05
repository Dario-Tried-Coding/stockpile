import { getUniqueValues } from '@/helpers'
import { db } from '@/lib/client/db'
import { GetUsersValidator, UpdateUserValidator } from '@/lib/common/validators/admin/users-table'
import { adminProcedure, router } from '@/lib/server/trpc/init'
import { getWorkspaceById } from '@/lib/utils/db/workspace'
import { getTableUsers } from '@/lib/utils/tables/users-table'
import { TRPCError } from '@trpc/server'
import { getTranslations } from 'next-intl/server'

export const adminRouter = router({
  getUsers: adminProcedure.input(GetUsersValidator).query(async ({ input: { userType }, ctx: { locale } }) => {
    const {assignedUsers, waitingUsers} = await getTableUsers()
    return userType === 'assigned' ? assignedUsers : waitingUsers
  }),
  updateUser: adminProcedure.input(UpdateUserValidator).mutation(async ({ input: { id, workspaceIds }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.Users.Table.Server'})

    const uniqueWorkspaceIds = getUniqueValues(workspaceIds)

    let verifiedWorkspaceIds: string[] = []
    for (const id of uniqueWorkspaceIds) {
      const workspace = await getWorkspaceById(id)
      if (!workspace) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.workspace-not-found')})
      verifiedWorkspaceIds.push(workspace.id)
    }

    await db.user.update({
      where: { id },
      data: {
        workspaces: { set: [] },
      },
    })

    await db.user.update({
      where: { id },
      data: {
        workspaces: {
          connect: [...verifiedWorkspaceIds.map((id) => ({ id }))],
        }
      },
    })

    return { id, message: t('Success.user-updated')}
  })
})
