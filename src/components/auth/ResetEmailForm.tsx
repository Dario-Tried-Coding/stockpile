'use client'

import FormMess from '@/components/auth/FormMess'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { useFormMess } from '@/hooks/auth/use-form-mess'
import { PasswordResetValidator, TPasswordResetValidator } from '@/lib/common/validators/auth'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'

interface ResetEmailFormProps extends HTMLAttributes<HTMLFormElement> {}

const ResetEmailForm: FC<ResetEmailFormProps> = ({ className, ...rest }) => {
  const t = useTranslations('Auth')

  const [message, setMessage] = useFormMess()

  const form = useForm<TPasswordResetValidator>({
    resolver: zodResolver(PasswordResetValidator),
    defaultValues: {
      email: '',
    },
  })

  const {
    isPending,
    mutate: sendResetEmail,
    isSuccess,
  } = trpc.auth.sendResetPasswordEmail.useMutation({
    onSuccess({ message }) {
      setMessage({ message, variant: 'success' })
    },
    onError(err) {
      setMessage({ message: err.message, variant: 'error' })
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    setMessage(null)
    sendResetEmail(data)
  })

  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)} {...rest} onSubmit={handleSubmit}>
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
                  disabled={isSuccess}
                  type='email'
                  onInput={() => {
                    if (message) setMessage(null)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {message !== null && <FormMess {...message} />}
        <Button className='w-full gap-1' type='submit' disabled={!form.formState.isValid || isSuccess}>
          {isPending && <Loader2 className='h-4 w-4 animate-spin' />} {t('Credentials.Reset.send')}
        </Button>
      </form>
    </Form>
  )
}

export default ResetEmailForm
