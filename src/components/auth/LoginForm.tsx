'use client'

import FormMess from '@/components/auth/FormMess'
import SocialAuth from '@/components/auth/SocialAuth'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import useOAuth from '@/hooks/auth/use-OAuth'
import { useFormMess } from '@/hooks/auth/use-form-mess'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { SignInValidator, TSignInValidator } from '@/lib/common/validators/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginFormProps extends HTMLAttributes<HTMLFormElement> {}

const LoginForm: FC<LoginFormProps> = ({ className, ...rest }) => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const [message, setMessage] = useFormMess()

  const [show2FA, setShow2FA] = useState(false)

  const form = useForm<TSignInValidator>({
    resolver: zodResolver(SignInValidator),
    defaultValues: {
      email: '',
      password: '',
      code: ''
    },
  })

  const {
    mutate: signUserIn,
    isPending: isCredentialsLoading,
    isSuccess,
    data,
  } = trpc.auth.signUserIn.useMutation({
    onSuccess(data) {
      if (data?.redirectUrl) router.push(data.redirectUrl)
      else if (data?.emailConfirmation) setMessage({ message: 'Email di conferma inviata. Controlla la casella di posta.', variant: 'success' })
      else if (data?.twoFactor) {
        setShow2FA(true)
        setMessage({ message: 'Codice di verifica inviato. Controlla la casella di posta.', variant: 'success' })
      }
    },
    onError(err) {
      if (err.message.includes('auth'))
        return setMessage({
          message: 'Email o password non corretti. Verifica e riprova.',
          variant: 'error',
        })

      if (err.data?.stack?.includes('2fa')) {
        if (err.data?.stack?.includes('tokenExpired'))
          return setMessage({
            message: 'Codice di verifica scaduto. Richiedine uno nuovo.',
            variant: 'error',
          })
        if (err.data?.stack?.includes('tokenInvalid'))
          return setMessage({
            message: 'Codice di verifica non valido. Verifica e riprova.',
            variant: 'error',
          })
      }
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    setMessage(null)
    signUserIn(data)
  })

  const { isOAuthLoading, continueWithOAuthProvider } = useOAuth({ callbackUrl })

  return (
    <Form {...form}>
      <form className={cn('self-stretch', className)} {...rest} onSubmit={handleSubmit}>
        <div className='space-y-4'>
          {show2FA ? (
            <>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='self-start'>Codice di verifica</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='123456'
                        min={0}
                        max={999999}
                        maxLength={6}
                        disabled={isCredentialsLoading || (isSuccess && !!data?.redirectUrl) || !!isOAuthLoading}
                        type='number'
                        onInput={() => {
                          if (message?.variant === 'error') setMessage(null)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='self-start'>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='mario.rossi@example.com'
                        disabled={isCredentialsLoading || (isSuccess && !!data?.redirectUrl) || !!isOAuthLoading}
                        type='email'
                        onInput={() => {
                          if (message) setMessage(null)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='self-start'>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='************'
                        disabled={isCredentialsLoading || (isSuccess && !!data?.redirectUrl) || !!isOAuthLoading}
                        type='password'
                        onInput={() => {
                          if (message) setMessage(null)
                        }}
                      />
                    </FormControl>
                    <Link href='/auth/reset' className='self-end text-xs font-medium underline-offset-4 hover:underline'>
                      Hai dimenticato la password?
                    </Link>
                  </FormItem>
                )}
              />
            </>
          )}
          {message !== null && <FormMess {...message} />}
          <Button
            className='w-full gap-1'
            type='submit'
            disabled={
              !!isOAuthLoading ||
              !form.formState.isValid ||
              isCredentialsLoading ||
              (isSuccess && !!data?.redirectUrl)
            }
          >
            {isCredentialsLoading && <Loader2 className='h-4 w-4 animate-spin' />}{' '}
            {isSuccess && !!data?.redirectUrl ? 'Attendi...' : 'Accedi'}
          </Button>
        </div>

        {!show2FA && (
          <>
            <div className='mt-6 flex items-center gap-2'>
              <Separator className='shrink' />
              <span className='shrink-0 grow-0 text-xs text-base-500'>O CONTINUA CON</span>
              <Separator className='shrink' />
            </div>

            <SocialAuth
              className='mt-6'
              continueWithProvider={continueWithOAuthProvider}
              isLoading={isOAuthLoading}
              disabled={isCredentialsLoading || (isSuccess && !!data?.redirectUrl)}
            />
          </>
        )}
      </form>
    </Form>
  )
}

export default LoginForm
