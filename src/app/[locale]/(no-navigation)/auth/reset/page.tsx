import AuthPage from '@/components/auth/AuthPage'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <AuthPage>
      <AuthPage.Heading text='Credentials.Reset.heading' />
      <AuthPage.Footnote text='Credentials.Reset.footnote' />
      <AuthPage.Forms.ResetEmail className='mt-6' />
      <AuthPage.Policy />
      <AuthPage.Link text='Credentials.Login.back-to-login' href='/auth/login' />
    </AuthPage>
  )
}

export default page
