'use client'

import { buttonVariants } from '@/components/ui/Button'
import { trpc } from '@/lib/server/trpc/trpc'
import { Bug, Loader2, MailCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({ }) => {
  const t = useTranslations('Auth')

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token)
    return (
      <>
        <h1 className='text-2xl font-semibold tracking-tighter'>{t('Credentials.Verify.Heading.error')}</h1>
        <p className='mt-2 text-sm text-base-500'>{t('Credentials.Verify.Footnote.generic-error')}</p>
        <Bug className='mt-8 h-12 w-12' />
        <p className='mt-8 text-sm text-base-500'>{t('Credentials.Verify.ContactSupport.error')}</p>
        <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
          {t('Credentials.Login.back-to-login')}
        </Link>
      </>
    )

  const { isError, isSuccess } = trpc.auth.verifyEmail.useQuery({ token })

  if (isError)
    return (
      <>
        <h1 className='text-2xl font-semibold tracking-tighter'>{t('Credentials.Verify.Heading.error')}</h1>
        <p className='mt-2 text-sm text-base-500'>{t('Credentials.Verify.Footnote.expired')}</p>
        <Bug className='mt-8 h-12 w-12' />
        <p className='mt-8 text-sm text-base-500'>{t('Credentials.Verify.ContactSupport.error')}</p>
        <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
          {t('Credentials.Login.back-to-login')}
        </Link>
      </>
    )
  
  if (isSuccess) return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>{t('Credentials.Verify.Heading.success')}</h1>
      <p className='mt-2 text-sm text-base-500'>{t('Credentials.Verify.Footnote.success')}</p>
      <MailCheck className='mt-8 h-12 w-12' />
      <p className='mt-8 text-sm text-base-500'>{t('Credentials.Verify.ContactSupport.success')}</p>
      <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        {t('Credentials.Login.back-to-login')}
      </Link>
    </>
  )
  
  return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>{t('Credentials.Verify.Heading.pending')}</h1>
      <p className='mt-2 text-sm text-base-500'>{t('Credentials.Verify.Footnote.pending')}</p>
      <Loader2 className='mt-8 h-12 w-12 animate-spin' />
      <p className='mt-8 text-sm text-base-500'>{t('Credentials.Verify.do-not-close-window')}</p>
      <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        {t('Credentials.Login.back-to-login')}
      </Link>
    </>
  )
}

export default page
