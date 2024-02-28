import AuthPage from '@/components/auth/AuthPage'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <AuthPage>
      <AuthPage.Heading text='Credentials.Register.cta-extended' />
      <AuthPage.Footnote text='Credentials.Register.footnote' />
      <AuthPage.Forms.Register className='mt-6' />
      <AuthPage.Policy />
      <AuthPage.Link text='Credentials.Login.cta' href='/auth/login' />
    </AuthPage>
  )
}

export default page
