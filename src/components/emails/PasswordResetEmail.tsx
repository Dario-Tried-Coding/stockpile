import { absoluteUrl } from '@/helpers'
import { FC } from 'react'

interface PasswordResetEmailProps {
  token: string
}

const PasswordResetEmail: FC<Readonly<PasswordResetEmailProps>> = ({token}) => {
  const verificationUrl = absoluteUrl(`/auth/new-password?token=${token}`)

  return (
    <p>
      Clicca <a href={verificationUrl}>qui</a> per impostare una nuova password.
    </p>
  )
}

export default PasswordResetEmail