import NewPasswordForm from '@/components/auth/NewPasswordForm'
import { buttonVariants } from '@/components/ui/Button'
import Link from 'next/link'
import { FC } from 'react'

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>Crea nuova password</h1>
      <p className='mt-2 text-sm text-base-500'>
        Inserisci l'indirizzo email che hai utilizzato per creare il tuo account e ti invieremo un link per reimpostarla.
      </p>
      <NewPasswordForm className='w-full mt-6' />
      <p className='mt-6 text-sm leading-6 text-base-500'>
        Continuando accetti i nostri{' '}
        <Link href='/terms-of-service' className='underline underline-offset-2'>
          Termini di servizio
        </Link>{' '}
        e{' '}
        <Link href='/privacy' className='underline underline-offset-2'>
          l'Informativa sulla privacy
        </Link>
        .
      </p>
      <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        Torna al login
      </Link>
    </>
  )
}

export default page