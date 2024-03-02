import { Locale, i18nConfig } from "@/config/i18n.config"

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function getLocalePrefix(pathname: string) {
  const { locales } = i18nConfig
  const segments = pathname.split('/')

  if (segments[0] === '') segments.shift()

  if (locales.some((locale) => locale === segments[0])) return segments[0] as Locale

  return '' as const
}

export function removeLocalePrefix(pathname: string) {
  const { locales } = i18nConfig

  const [path, queryParams] = pathname.split('?')

  const chunks = path.split('/')
  if (chunks[0] === '') chunks.shift()

  const localePrefix = chunks[0]
  
  if (locales.includes(localePrefix as Locale)) {
    chunks.splice(0, 1)
    const sanitizedPathname = chunks.join('/') || '/'
    const sanitizedPathnameWithQuery = queryParams ? `${sanitizedPathname}?${queryParams}` : sanitizedPathname
    return sanitizedPathnameWithQuery
  }
  return pathname
}