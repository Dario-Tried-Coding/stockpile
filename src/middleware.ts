import { i18nConfig } from '@/config/i18n.config'
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefixes, authRoutes, publicRoutes } from '@/config/routes.config'
import { i18nMiddleware } from '@/lib/common/i18n/middleware'
import { auth } from '@/lib/server/auth'

const { locales } = i18nConfig

function getLocalePrefix(pathname: string) {
  const segments = pathname.split('/')

  if (segments[0] === '') segments.shift()

  if (locales.some(locale => locale === segments[0])) return segments[0]

  return ''
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const localePrefix = getLocalePrefix(nextUrl.pathname)
  // console.log('middleware ->', {pathname: nextUrl.pathname, isLoggedIn, localePrefix})

  const isApiAuthRoute = apiAuthPrefixes.some((prefix) => nextUrl.pathname.startsWith(prefix))
  const isPublicRoute = publicRoutes.some((prefix) => nextUrl.pathname.includes(prefix))
  const isAuthRoute = authRoutes.some((prefix) => nextUrl.pathname.includes(prefix))

  if (isApiAuthRoute) {
    return
  }

  if (isAuthRoute) {
    if (isLoggedIn) return Response.redirect(new URL(`${localePrefix}/${DEFAULT_LOGIN_REDIRECT}`, nextUrl))
    return i18nMiddleware(req)
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) callbackUrl += nextUrl.search
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`${localePrefix}/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
  }

  return i18nMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
}
