'use client'

import FormMess, { FormMessProps } from '@/components/auth/FormMess'
import SocialAuth from '@/components/auth/SocialAuth'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { REDIRECT_URL_QUERY_PARAM } from '@/config/auth.config'
import { absoluteUrl } from '@/helpers/routing'
import useOAuth from '@/hooks/auth/use-OAuth'
import { SignInValidator, TSignInValidator } from '@/lib/common/validators/auth'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC, HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginFormProps extends HTMLAttributes<HTMLFormElement> {}

const LoginForm: FC<LoginFormProps> = ({ className, ...rest }) => {
  const t = useTranslations('Auth')

  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get(REDIRECT_URL_QUERY_PARAM)
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? t('OAuth.email-already-in-use') : null

  const [message, setMessage] = useState<FormMessProps | null>(urlError ? { variant: 'error', message: urlError } : null)

  const [show2FA, setShow2FA] = useState(false)

  const form = useForm<TSignInValidator>({
    resolver: zodResolver(SignInValidator),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  })

  const {
    mutate: signUserIn,
    isPending: isCredentialsLoading,
    isSuccess,
    data,
  } = trpc.auth.signUserIn.useMutation({
    onSuccess(data) {
      if (data?.redirectUrl) window.location.href = absoluteUrl(redirectUrl || data.redirectUrl)
      else if (data?.emailConfirmation) setMessage({ message: data.message, variant: 'success' })
      else if (data?.twoFactor) {
        setShow2FA(true)
        setMessage({ message: data.message, variant: 'success' })
      }
    },
    onError(err) {
      return setMessage({ message: err.message, variant: 'error' })
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    setMessage(null)
    signUserIn(data)
  })

  const { isOAuthLoading, continueWithOAuthProvider } = useOAuth({ redirectUrl })

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
                    <FormLabel className='self-start'>{t('Fields.2FA.label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('Fields.2FA.placeholder')}
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
                    <FormLabel className='self-start'>{t('Fields.Email.label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('Fields.Email.placeholder')}
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
                    <FormLabel className='self-start'>{t('Fields.Password.label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('Fields.Password.placeholder')}
                        disabled={isCredentialsLoading || (isSuccess && !!data?.redirectUrl) || !!isOAuthLoading}
                        type='password'
                        onInput={() => {
                          if (message) setMessage(null)
                        }}
                      />
                    </FormControl>
                    <Link href='/auth/reset' className='self-end text-xs font-medium underline-offset-4 hover:underline'>
                      {t('Credentials.Reset.link')}
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
            disabled={!!isOAuthLoading || !form.formState.isValid || isCredentialsLoading || (isSuccess && !!data?.redirectUrl)}
          >
            {isCredentialsLoading && <Loader2 className='h-4 w-4 animate-spin' />}{' '}
            {isSuccess && !!data?.redirectUrl ? t('Credentials.Login.wait') : t('Credentials.Login.cta')}
          </Button>
        </div>

        {!show2FA && (
          <>
            <div className='mt-6 flex items-center gap-2'>
              <Separator className='shrink' />
              <span className='shrink-0 grow-0 text-xs text-base-500'>{t('OAuth.or-continue-with')}</span>
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
