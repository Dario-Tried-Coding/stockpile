import { TOKEN_QUERY_PARAM } from '@/config/auth.config'
import { absoluteUrl } from '@/helpers/routing'
import { FC } from 'react'

interface VerificationEmailProps {
  token: string
}

const VerificationEmail: FC<VerificationEmailProps> = ({ token }) => {
  const verificationUrl = absoluteUrl(`/auth/verify?${TOKEN_QUERY_PARAM}=${token}`)
  return (
    <p>
      Clicca <a href={verificationUrl}>qui</a> per verificare la tua email.
    </p>
  )
}

export default VerificationEmail
