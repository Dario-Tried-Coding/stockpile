import AuthPage from '@/components/auth/AuthPage'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <AuthPage>
      <AuthPage.Heading text='Credentials.Login.cta-extended' />
      <AuthPage.Footnote text='Credentials.Login.footnote' />
      <AuthPage.Forms.Login className='mt-6' />
      <AuthPage.Policy />
      <AuthPage.Link text='Credentials.Register.cta' href='/auth/register' />
    </AuthPage>
  )
}

export default page
