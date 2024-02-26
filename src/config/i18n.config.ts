export const i18nConfig = {
  defaultLocale: 'it',
  locales: ['en', 'it'],
  localePrefix: 'never',
  cookie: 'NEXT_LOCALE'
} as const

export type Locale = typeof i18nConfig.locales[number]