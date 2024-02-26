import { Locale, i18nConfig } from "@/config/i18n.config"

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function getUniqueValues<T>(arr: T[]): T[] {
  const set = new Set(arr)
  return Array.from(set)
}

export function getLocalePrefix(pathname: string) {
  const { locales } = i18nConfig
  const segments = pathname.split('/')

  if (segments[0] === '') segments.shift()

  if (locales.some((locale) => locale === segments[0])) return segments[0] as Locale

  return '' as const
}