import NewPasswordForm from '@/components/auth/NewPasswordForm'
import { buttonVariants } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = ({ }) => {
  const t = useTranslations('Auth')

  return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>{t('Credentials.NewPassword.heading')}</h1>
      <p className='mt-2 text-sm text-base-500'>{t('Credentials.NewPassword.footnote')}</p>
      <NewPasswordForm className='mt-6 w-full' />
      <p className='mt-6 text-sm leading-6 text-base-500'>
        {t.rich('policy', {
          termsLink: (chunk) => (
            <Link href='/terms-of-service' className='underline underline-offset-2'>
              {chunk}
            </Link>
          ),
          privacyLink: (chunk) => (
            <Link href='/privacy' className='underline underline-offset-2'>
              {chunk}
            </Link>
          ),
        })}
      </p>
      <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        {t('Credentials.Login.back-to-login')}
      </Link>
    </>
  )
}

export default page