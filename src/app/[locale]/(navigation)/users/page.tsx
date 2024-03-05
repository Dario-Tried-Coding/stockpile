import { isAdmin } from '@/helpers/auth'
import { getUsersTableData } from '@/lib/utils/tables/users-table'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import UsersTable from '@/components/table/users/UsersTable'

interface pageProps {}

const page: FC<pageProps> = async ({ }) => {
  await isAdmin()

  const t = await getTranslations('Pages.Users')

  const {assignedUsers, waitingUsers, availableWorkspaces} = await getUsersTableData()

  return (
    <>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>{t('heading')}</h1>
        <p className='text-muted-foreground'>{t('sub-heading')}</p>
      </div>
      <Tabs defaultValue='overview' className='mt-6'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='new' disabled={waitingUsers?.length === 0}>
              Nuovi
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            <UsersTable initialUsers={assignedUsers} userType='assigned' availableWorkspaces={availableWorkspaces} />
          </TabsContent>
          <TabsContent value='new'>
            <UsersTable initialUsers={waitingUsers} userType='waiting' availableWorkspaces={availableWorkspaces} />
          </TabsContent>
        </Tabs>
    </>
  )
}

export default page