import LogoutBtn from '@/components/LogoutBtn'
import Dashboard from '@/components/pages/Dashboard'
import { auth } from '@/lib/server/auth'
import { getTranslations } from 'next-intl/server'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await auth()
  const t = await getTranslations('Index')
  return (
    // <div>
    //   {t('test')} <br /> <pre>{JSON.stringify(session?.user, null, 2)} <LogoutBtn /></pre>
    // </div>
    <Dashboard />
  )
}

export default page
