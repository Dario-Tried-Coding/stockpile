import ClientProviders from '@/components/providers/ClientProviders'
import { Toaster } from '@/components/ui/Sonner'
import { Locale } from '@/config/i18n.config'
import { auth } from '@/lib/server/auth'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { FC, PropsWithChildren } from 'react'

interface ProvidersProps extends PropsWithChildren {
  locale: Locale
}

const Providers: FC<ProvidersProps> = async ({ children, locale }) => {
  const session = await auth()
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={session}>
        <Toaster />
        <ClientProviders>{children}</ClientProviders>
      </SessionProvider>
    </NextIntlClientProvider>
  )
}

export default Providers
