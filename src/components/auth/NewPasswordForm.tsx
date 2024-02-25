'use client'

import FormMess from '@/components/auth/FormMess'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { useFormMess } from '@/hooks/auth/use-form-mess'
import { trpc } from '@/lib/server/trpc/trpc'
import { cn } from '@/lib/utils'
import { NewPasswordValidator, TNewPasswordValidator } from '@/lib/common/validators/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FC, HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'

interface NewPasswordFormProps extends HTMLAttributes<HTMLFormElement> {}

const NewPasswordForm: FC<NewPasswordFormProps> = ({ className, ...rest }) => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [message, setMessage] = useFormMess()

  const form = useForm<TNewPasswordValidator>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token
    },
  })

  const { isPending, mutate: createNewPassword, isSuccess } = trpc.auth.createNewPassword.useMutation({
    onSuccess() {
      setMessage({variant: 'success', message: 'Password creata con successo.'})
    },
    onError(err) {
      if (err.data?.code === 'BAD_REQUEST') return setMessage({variant: 'error', message: 'Impossibile creare nuova password.'})
      else if (err.data?.code === 'NOT_FOUND') return setMessage({variant: 'error', message: 'Impossibile creare nuova password. Token non valido.'})
      else if (err.data?.code === 'FORBIDDEN') return setMessage({variant: 'error', message: 'Impossibile creare nuova password. Token scaduto.'})
    }
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
              <FormLabel className='self-start'>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder='*************' disabled={isSuccess} type='password' />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name='confirmPassword'
          control={form.control}
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className='self-start'>Conferma password</FormLabel>
              <FormControl>
                <Input {...field} placeholder='*************' disabled={isSuccess} type='password' />
              </FormControl>
            </FormItem>
          )}
        />
        {form.getValues().password !== form.getValues().confirmPassword && <p className='text-sm'>Assicurati che le password coincidano.</p> }
        {message !== null && <FormMess {...message} />}
        <Button className='w-full gap-1' type='submit' disabled={!form.formState.isValid || isSuccess}>
          {isPending && <Loader2 className='h-4 w-4 animate-spin' />} Crea nuova password
        </Button>
      </form>
    </Form>
  )
}

export default NewPasswordForm
