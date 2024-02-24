import { i18nMiddleware } from '@/lib/common/i18n/middleware'
import { auth } from '@/lib/server/auth'

export default auth(req => {
  console.log('middleware ->', req.nextUrl.pathname, !!req.auth)

  return i18nMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
}
