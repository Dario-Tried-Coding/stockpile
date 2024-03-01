import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes.config'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

type Options = {
  redirectUrl: string | null
}

export default function useOAuth({ redirectUrl }: Options) {
  const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | null>(null)

  const continueWithOAuthProvider = async (provider: 'google') => {
    setIsOAuthLoading(provider)

    try {
      await signIn(provider, { callbackUrl: redirectUrl || DEFAULT_LOGIN_REDIRECT })
    } catch (err) {
      toast('Errore', {
        description: `Si è verificato un errore durante l'accesso con ${provider}.`,
      })
    } finally {
      setIsOAuthLoading(null)
    }
  }

  return { isOAuthLoading, continueWithOAuthProvider }
}
