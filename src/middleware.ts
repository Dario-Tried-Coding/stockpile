import { REDIRECT_URL_QUERY_PARAM } from '@/config/auth.config'
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefixes, authRoutes, publicRoutes } from '@/config/routes.config'
import { getLocalePrefix, removeLocalePrefix } from '@/helpers/routing'
import { i18nMiddleware } from '@/lib/common/i18n/middleware'
import { auth } from '@/lib/server/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const localePrefix = getLocalePrefix(nextUrl.pathname)

  const isApiAuthRoute = apiAuthPrefixes.some((prefix) => nextUrl.pathname.startsWith(prefix))
  const isPublicRoute = publicRoutes.some((prefix) => nextUrl.pathname.includes(prefix))
  const isAuthRoute = authRoutes.some((prefix) => nextUrl.pathname.includes(prefix))

  // If it's an API route, we don't need to do anything
  if (isApiAuthRoute) {
    return
  }

  // If it's an auth route, we need to redirect to the homepage if the user is already logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(`${localePrefix}${DEFAULT_LOGIN_REDIRECT}`, nextUrl))
    }
    return i18nMiddleware(req)
  }

  // If it's a private page and the user is not logged in, redirect to the login page
  if (!isLoggedIn && !isPublicRoute) {

    let callbackUrl = removeLocalePrefix(nextUrl.pathname)
    if (nextUrl.search) callbackUrl += nextUrl.search
    const encodedRedirectUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(new URL(`${localePrefix}/auth/login?${REDIRECT_URL_QUERY_PARAM}=${encodedRedirectUrl}`, nextUrl))
  }

  return i18nMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
}
