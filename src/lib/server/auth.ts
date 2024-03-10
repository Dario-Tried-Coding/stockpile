import { authConfig } from '@/config/auth.config'
import { db } from '@/lib/client/db'
import { getTwoFactorConfirmationByUserId } from '@/lib/utils/db/2fa-confirmation'
import { getUserById } from '@/lib/utils/db/user'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true

      if (!user || !user.id) return false
      const dbUser = await getUserById(user.id)

      if (!dbUser?.emailVerified) return false

      if (dbUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(dbUser.id)

        if (!twoFactorConfirmation) return false

        const hasExpired = new Date() > new Date(twoFactorConfirmation.expiresAt)

        if (hasExpired) {
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          })

          return false
        }
      }

      return true
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const dbUser = await getUserById(token.sub)
      if (!dbUser) return token

      token.id = dbUser.id
      token.isAdmin = dbUser.isAdmin
      
      return token
    },
    async session({ session, token }) {
      if (!session.user) return session

      session.user.id = token.id
      session.user.isAdmin = token.isAdmin

      return session
    },
  },
  ...authConfig,
})
