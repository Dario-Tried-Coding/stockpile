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
import { RegisterValidator, TRegisterValidator } from '@/lib/common/validators/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'

interface RegisterFormProps extends HTMLAttributes<HTMLFormElement> {}

const RegisterForm: FC<RegisterFormProps> = ({ className, ...rest }) => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

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

  const { mutate: createCredentialsUser, isPending: isCredentialsLoading, isSuccess } = trpc.auth.createUser.useMutation({
    onSuccess() {
      setMessage({ message: 'Email di conferma inviata. Controlla la casella di posta.', variant: 'success' })
    },
    onError(err) {
      if (err.data?.code === 'CONFLICT') return setMessage({ message: 'Email già in uso.', variant: 'error' })
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
                <FormLabel className='self-start'>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Mario Rossi' disabled={!!isOAuthLoading || isCredentialsLoading || isSuccess} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='self-start'>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='mario.rossi@example.com' disabled={!!isOAuthLoading || isCredentialsLoading || isSuccess} type='email' />
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
                  <Input {...field} placeholder='************' disabled={!!isOAuthLoading || isCredentialsLoading || isSuccess} type='password' />
                </FormControl>
              </FormItem>
            )}
          />
          {message !== null && <FormMess {...message} />}
          <Button className='w-full gap-1' type='submit' disabled={!!isOAuthLoading || !form.formState.isValid || isCredentialsLoading || isSuccess}>
            {isCredentialsLoading && <Loader2 className='h-4 w-4 animate-spin' />} Crea account
          </Button>
        </div>

        <div className='mt-6 flex items-center gap-2'>
          <Separator className='shrink' />
          <span className='shrink-0 grow-0 text-xs text-base-500'>O CONTINUA CON</span>
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
