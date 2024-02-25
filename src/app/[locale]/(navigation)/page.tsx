import { auth } from '@/lib/server/auth'
import { FC } from 'react'
import { getTranslations } from 'next-intl/server'
import LogoutBtn from '@/components/LogoutBtn'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await auth()
  const t = await getTranslations('Index')
  return (
    <div>
      {t('test')} <br /> <pre>{JSON.stringify(session?.user, null, 2)} <LogoutBtn /></pre>
    </div>
  )
}

export default page
