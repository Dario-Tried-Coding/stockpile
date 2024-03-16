import LogoutBtn from '@/components/LogoutBtn'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({ }) => {  
  const t = useTranslations('Auth')
  return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>{t('Wait.heading')}</h1>
      <p className='mt-2 text-sm text-base-500'>{t('Wait.sub-heading')}</p>
      <Lock className='mt-8 h-12 w-12' />
      <p className='mt-8 text-sm text-base-500'>{t('Wait.contact-support')}</p>
      <LogoutBtn className='absolute right-5 top-5 lg:right-20 lg:top-10' />
    </>
  )
}

export default page