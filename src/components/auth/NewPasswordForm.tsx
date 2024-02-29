'use client'

import FormMess, { FormMessProps } from '@/components/auth/FormMess'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { NewPasswordValidator, TNewPasswordValidator } from '@/lib/common/validators/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FC, HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

interface NewPasswordFormProps extends HTMLAttributes<HTMLFormElement> {}

const NewPasswordForm: FC<NewPasswordFormProps> = ({ className, ...rest }) => {
  const t = useTranslations('Auth')

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [message, setMessage] = useState<FormMessProps | null>(null)

  const form = useForm<TNewPasswordValidator>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token,
    },
  })

  const {
    isPending,
    mutate: createNewPassword,
    isSuccess,
  } = trpc.auth.createNewPassword.useMutation({
    onSuccess({ message }) {
      setMessage({ variant: 'success', message })
    },
    onError(err) {
      setMessage({ variant: 'error', message: err.message })
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    setMessage(null)
    createNewPassword(data)
  })

  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)} {...rest} onSubmit={handleSubmit}>
        <FormField
          name='password'
          control={form.control}
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='self-start'>{t('Fields.Password.label')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('Fields.Password.placeholder')} disabled={isSuccess} type='password' />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='confirmPassword'
          control={form.control}
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='self-start'>{t('Fields.ConfirmPassword.label')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('Fields.ConfirmPassword.placeholder')} disabled={isSuccess} type='password' />
              </FormControl>
            </FormItem>
          )}
        />
        {form.getValues().password !== form.getValues().confirmPassword && <p className='text-sm'>{t('Feedbacks.Client.Errors.confirm-password')}</p>}
        {message !== null && <FormMess {...message} />}
        <Button className='w-full gap-1' type='submit' disabled={!form.formState.isValid || isSuccess}>
          {isPending && <Loader2 className='h-4 w-4 animate-spin' />} {t('Credentials.NewPassword.cta')}
        </Button>
      </form>
    </Form>
  )
}

export default NewPasswordForm
