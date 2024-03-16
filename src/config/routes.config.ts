export const publicRoutes: string[] = []

export const authRoutes: string[] = ['/auth/login', '/auth/register', '/auth/error', '/auth/reset', '/auth/new-password', '/auth/verify']

export const apiAuthPrefixes: string[] = ['/api/auth', '/api/trpc/auth']

export const DEFAULT_LOGIN_REDIRECT = '/' as const
export const UNASSIGNED_REDIRECT = '/auth/wait' as const