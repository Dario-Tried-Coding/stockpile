import { REDIRECT_URL_QUERY_PARAM } from '@/config/auth.config'
import { DEFAULT_LOGIN_REDIRECT, UNASSIGNED_REDIRECT, apiAuthPrefixes, authRoutes, publicRoutes } from '@/config/routes.config'
import { getLocalePrefix, removeLocalePrefix } from '@/helpers/routing'
import { i18nMiddleware } from '@/lib/common/i18n/middleware'
import { auth } from '@/lib/server/auth'

export default auth((req) => {
  const { nextUrl, auth } = req
  const isLoggedIn = !!auth

  const localePrefix = getLocalePrefix(nextUrl.pathname)

  const isApiAuthRoute = apiAuthPrefixes.some((prefix) => nextUrl.pathname.startsWith(prefix))
  const isPublicRoute = publicRoutes.some((prefix) => nextUrl.pathname.includes(prefix))
  const isAuthRoute = authRoutes.some((prefix) => nextUrl.pathname.includes(prefix))
  const isUnassignedRoute = nextUrl.pathname.includes(UNASSIGNED_REDIRECT)

  const isAdmin = auth?.user?.isAdmin
  const isAssigned = !!auth?.user?.workspaceId

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

  // If he's logged in but not assigned, redirect to the wait page
  if (isLoggedIn) {
    if (!isUnassignedRoute && !isAssigned && !isAdmin) return Response.redirect(new URL(`${localePrefix}${UNASSIGNED_REDIRECT}`, nextUrl))
    if (isUnassignedRoute && (isAssigned || isAdmin)) return Response.redirect(new URL(`${localePrefix}${DEFAULT_LOGIN_REDIRECT}`, nextUrl))
  }

  return i18nMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
}
