'use client'

import { buttonVariants } from '@/components/ui/Button'
import { trpc } from '@/lib/server/trpc/trpc'
import { Bug, Loader2, MailCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({ }) => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token)
    return (
      <>
        <h1 className='text-2xl font-semibold tracking-tighter'>Conferma email non riuscita</h1>
        <p className='mt-2 text-sm text-base-500'>Non è stato possibile verificare la tua email. Per piacere riprova.</p>
        <Bug className='mt-8 h-12 w-12' />
        <p className='mt-8 text-sm text-base-500'>Se il problema persiste, per piacere contatta l'assistenza.</p>
        <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
          Torna al login
        </Link>
      </>
    )

  const { isError, isSuccess } = trpc.auth.verifyEmail.useQuery({ token })

  if (isError)
    return (
      <>
        <h1 className='text-2xl font-semibold tracking-tighter'>Conferma email non riuscita</h1>
        <p className='mt-2 text-sm text-base-500'>Il token fornito non è valido o è scaduto.</p>
        <Bug className='mt-8 h-12 w-12' />
        <p className='mt-8 text-sm text-base-500'>Se il problema persiste, per piacere contatta l'assistenza.</p>
        <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
          Torna al login
        </Link>
      </>
    )
  
  if (isSuccess) return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>Conferma email riuscita</h1>
      <p className='mt-2 text-sm text-base-500'>La tua email è stata verificata con successo. Puoi utilizzare il nostro servizio adesso.</p>
      <MailCheck className='mt-8 h-12 w-12' />
      <p className='mt-8 text-sm text-base-500'>Per qualsiasi dubbio, contatta il nostro team di supporto.</p>
      <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        Torna al login
      </Link>
    </>
  )
  
  return (
    <>
      <h1 className='text-2xl font-semibold tracking-tighter'>Conferma email in corso...</h1>
      <p className='mt-2 text-sm text-base-500'>Per piacere attendi mentre verifichiamo la tua email.</p>
      <Loader2 className='mt-8 h-12 w-12 animate-spin' />
      <p className='mt-8 text-sm text-base-500'>Ci possono volere alcuni istanti. Per piacere non chiudere la pagina.</p>
      <Link href='/auth/login' className={buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' })}>
        Torna al login
      </Link>
    </>
  )
}

export default page
