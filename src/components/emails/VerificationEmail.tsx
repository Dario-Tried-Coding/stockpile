import { absoluteUrl } from '@/helpers'
import { FC } from 'react'

interface VerificationEmailProps {
  token: string
}

const VerificationEmail: FC<VerificationEmailProps> = ({ token }) => {
  const verificationUrl = absoluteUrl(`/auth/verify?token=${token}`)
  return (
    <p>
      Clicca <a href={verificationUrl}>qui</a> per verificare la tua email.
    </p>
  )
}

export default VerificationEmail
