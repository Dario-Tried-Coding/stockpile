import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { i18nConfig } from '@/config/i18n.config'

const {locales} = i18nConfig

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../../../i18n/${locale}.json`)).default,
  }
})