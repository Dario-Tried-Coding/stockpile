import { i18nConfig } from '@/config/i18n.config'
import createMiddleware from 'next-intl/middleware'

const { locales, defaultLocale, localePrefix } = i18nConfig

export const i18nMiddleware = createMiddleware({ locales, defaultLocale, localePrefix })
