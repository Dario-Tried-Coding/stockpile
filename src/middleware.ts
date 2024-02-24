import { i18nMiddleware } from '@/lib/common/i18n/middleware'
import { NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
  console.log('middleware ->', req.nextUrl.pathname)

  return i18nMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
}
