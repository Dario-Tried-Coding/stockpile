import { getUserByEmail } from '@/lib/utils/db/user'
import { SignInValidator } from '@/lib/common/validators/auth'
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

export const REDIRECT_URL_QUERY_PARAM = 'redirect-url' as const
export const TOKEN_QUERY_PARAM = 'token' as const

export const authConfig = {
  pages: {
    signIn: '/auth/login'
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInValidator.safeParse(credentials)

        if (!validatedFields.success) return null

        const { email, password } = validatedFields.data

        const user = await getUserByEmail(email)

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) return null

        return user
      },
    }),
  ],
} satisfies NextAuthConfig
