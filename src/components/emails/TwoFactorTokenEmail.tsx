import { FC } from 'react'

interface TwoFactorTokenEmailProps {
  token: string
}

const TwoFactorTokenEmail: FC<Readonly<TwoFactorTokenEmailProps>> = ({ token }) => {
  return <p>Il tuo codice di verifica è: {token}.</p>
}

export default TwoFactorTokenEmail