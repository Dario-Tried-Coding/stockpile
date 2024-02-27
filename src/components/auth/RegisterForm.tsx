'use client'

import FormMess from '@/components/auth/FormMess'
import SocialAuth from '@/components/auth/SocialAuth'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { CALLBACK_URL } from '@/config/auth.config'
import useOAuth from '@/hooks/auth/use-OAuth'
import { useFormMess } from '@/hooks/auth/use-form-mess'
import { RegisterValidator, TRegisterValidator } from '@/lib/common/validators/auth'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { FC, HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'

interface RegisterFormProps extends HTMLAttributes<HTMLFormElement> {}

const RegisterForm: FC<RegisterFormProps> = ({ className, ...rest }) => {
  const t = useTranslations('Auth')

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get(CALLBACK_URL)

  const [message, setMessage] = useFormMess()

  const { isOAuthLoading, continueWithOAuthProvider } = useOAuth({ callbackUrl })

  const form = useForm<TRegisterValidator>({
    resolver: zodResolver(RegisterValidator),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const {
    mutate: createCredentialsUser,
    isPending: isCredentialsLoading,
    isSuccess,
  } = trpc.auth.createUser.useMutation({
    onSuccess(message) {
      setMessage({ message, variant: 'success' })
    },
    onError(err) {
      setMessage({ message: err.message, variant: 'error' })
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    setMessage(null)
    createCredentialsUser(data)
  })

  return (
    <Form {...form}>
      <form className={cn('self-stretch', className)} {...rest} onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='self-start'>{t('Fields.Name.label')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('Fields.Name.placeholder')} disabled={!!isOAuthLoading || isCredentialsLoading || isSuccess} />
                </FormControl>
              </FormItem>
            )}
          />
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
                    disabled={!!isOAuthLoading || isCredentialsLoading || isSuccess}
                    type='email'
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
                    disabled={!!isOAuthLoading || isCredentialsLoading || isSuccess}
                    type='password'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {message !== null && <FormMess {...message} />}
          <Button className='w-full gap-1' type='submit' disabled={!!isOAuthLoading || !form.formState.isValid || isCredentialsLoading || isSuccess}>
            {isCredentialsLoading && <Loader2 className='h-4 w-4 animate-spin' />} {t('Credentials.Register.cta')}
          </Button>
        </div>

        <div className='mt-6 flex items-center gap-2'>
          <Separator className='shrink' />
          <span className='shrink-0 grow-0 text-xs text-base-500'>{t('OAuth.or-continue-with')}</span>
          <Separator className='shrink' />
        </div>

        <SocialAuth
          className='mt-6'
          continueWithProvider={continueWithOAuthProvider}
          isLoading={isOAuthLoading}
          disabled={isCredentialsLoading || isSuccess}
        />
      </form>
    </Form>
  )
}

export default RegisterForm
