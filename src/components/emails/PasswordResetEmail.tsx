import { TOKEN_QUERY_PARAM } from '@/config/auth.config'
import { absoluteUrl } from '@/helpers/routing'
import { FC } from 'react'

interface PasswordResetEmailProps {
  token: string
}

const PasswordResetEmail: FC<Readonly<PasswordResetEmailProps>> = ({token}) => {
  const verificationUrl = absoluteUrl(`/auth/new-password?${TOKEN_QUERY_PARAM}=${token}`)

  return (
    <p>
      Clicca <a href={verificationUrl}>qui</a> per impostare una nuova password.
    </p>
  )
}

export default PasswordResetEmail