import AuthPage from '@/components/auth/AuthPage'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <AuthPage>
      <AuthPage.Heading text='Credentials.NewPassword.heading' />
      <AuthPage.Footnote text='Credentials.NewPassword.footnote' />
      <AuthPage.Forms.NewPassword className='mt-6 w-full' />
      <AuthPage.Policy />
      <AuthPage.Link text='Credentials.Login.back-to-login' href='/auth/login' />
    </AuthPage>
  )
}

export default page
