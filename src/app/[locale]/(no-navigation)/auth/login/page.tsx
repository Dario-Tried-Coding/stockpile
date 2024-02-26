import LoginForm from '@/components/auth/LoginForm'
import { buttonVariants } from '@/components/ui/Button'
import Link from 'next/link'
import { FC } from 'react'
import { useTranslations } from 'next-intl'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const t = useTranslations('Auth')

  return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>{t('Credentials.Login.cta-extended')}</h1>
      <p className='mt-2 text-sm text-base-500'>{t('Credentials.Login.footnote')}</p>
      <LoginForm className='mt-6' />
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
      <Link href='/auth/register' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        {t('Credentials.Register.cta')}
      </Link>
    </>
  )
}

export default page
