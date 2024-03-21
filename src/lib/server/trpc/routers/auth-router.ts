import { DEFAULT_LOGIN_REDIRECT } from '@/config/routes.config'
import { New2FAConfirmationNeededError } from '@/errors/auth'
import { db } from '@/lib/client/db'
import { NewPasswordValidator, PasswordResetValidator, RegisterValidator, SignInValidator } from '@/lib/common/validators/auth'
import { signIn } from '@/lib/server/auth'
import { publicProcedure, router } from '@/lib/server/trpc/init'
import { getTwoFactorConfirmationByUserId } from '@/lib/utils/db/2fa-confirmation'
import { getTwoFactorTokenByEmail } from '@/lib/utils/db/2fa-token'
import { getPasswordResetTokenByToken } from '@/lib/utils/db/password-reset-token'
import { getUserByEmail } from '@/lib/utils/db/user'
import { getVerificationTokenByToken } from '@/lib/utils/db/verification-token'
import { sendPassorwordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/utils/emails'
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from '@/lib/utils/tokens'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'

export const authRouter = router({
  createUser: publicProcedure.input(RegisterValidator).mutation(async ({ input: { email, password, name }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Auth.Feedbacks.Server' })

    const dbUser = await getUserByEmail(email)

    if (dbUser) throw new TRPCError({ code: 'CONFLICT', message: t('Errors.email-not-usable') })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const verificationToken = await generateVerificationToken(user.email!)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return t('Success.confirmation-email-sent')
  }),
  signUserIn: publicProcedure.input(SignInValidator).mutation(async ({ input: { email, password, code }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Auth.Feedbacks.Server' })
    const errorsT = await getTranslations({ locale, namespace: 'Index.Server.Errors' })

    // Check credentials
    const dbUser = await getUserByEmail(email)

    if (!dbUser || !dbUser.email || !dbUser.password) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.wrong-credentials') })

    const isPasswordValid = await bcrypt.compare(password, dbUser.password)
    if (!isPasswordValid) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.wrong-credentials') })

    // Check if email is verified
    if (!dbUser.emailVerified) {
      const verificationToken = await generateVerificationToken(dbUser.email)
      await sendVerificationEmail(verificationToken.email, verificationToken.token)

      return { emailConfirmation: true, message: t('Success.confirmation-email-sent') }
    }

    // Check if 2FA is enabled
    if (dbUser.isTwoFactorEnabled) {
      try {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(dbUser.id)
        if (!twoFactorConfirmation) throw new New2FAConfirmationNeededError()

        const hasExpired = new Date() > new Date(twoFactorConfirmation.expiresAt)
        if (hasExpired) if (!code) throw new New2FAConfirmationNeededError()
      } catch (error) {
        if (error instanceof New2FAConfirmationNeededError) {
          // Check if already has a 2FA token or still needs to generate one
          if (!code) {
            const twoFactorToken = await generateTwoFactorToken(dbUser.email)
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

            return { twoFactor: true, message: t('Success.2FA-email-sent') }
          }

          const twoFactorToken = await getTwoFactorTokenByEmail(dbUser.email)
          if (!twoFactorToken) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.2fa-token-invalid') })

          const hasExpired = new Date(twoFactorToken.expiresAt) < new Date()
          if (hasExpired) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.2fa-token-expired') })

          const isCodeValid = twoFactorToken.token === code
          if (!isCodeValid) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.2fa-token-invalid') })

          await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } })

          const existingConfirmation = await getTwoFactorConfirmationByUserId(dbUser.id)
          if (existingConfirmation)
            await db.twoFactorConfirmation.delete({
              where: { id: existingConfirmation.id },
            })

          await db.twoFactorConfirmation.create({
            data: { userId: dbUser.id, expiresAt: new Date(new Date().getTime() + 24 * 3600 * 1000) },
          })
        }
      }
    }

    try {
      const redirectUrl = (await signIn('credentials', { email, password, redirect: false, redirectTo: DEFAULT_LOGIN_REDIRECT })) as string
      return { redirectUrl }
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === 'CredentialsSignin') throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.wrong-credentials') })
        else throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: errorsT('500') })
      }
    }
  }),
  verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input: { token }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Auth.Feedbacks.Server' })

    const verificationToken = await getVerificationTokenByToken(token)

    if (!verificationToken) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.2fa-token-invalid') })

    const hasExpired = new Date(verificationToken.expiresAt) < new Date()

    if (hasExpired) throw new TRPCError({ code: 'FORBIDDEN', message: t('Errors.2fa-token-expired') })

    const dbUser = await getUserByEmail(verificationToken.email)

    if (!dbUser) throw new TRPCError({ code: 'NOT_FOUND', message: t('Errors.user-not-found') })

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        emailVerified: new Date(),
        email: verificationToken.email,
      },
    })

    await db.verificationToken.delete({ where: { id: verificationToken.id } })

    return { message: t('Success.email-verified') }
  }),
  sendResetPasswordEmail: publicProcedure.input(PasswordResetValidator).mutation(async ({ input: { email }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Auth' })

    const dbUser = await getUserByEmail(email)

    if (!dbUser) throw new TRPCError({ code: 'NOT_FOUND', message: t('Feedbacks.Server.Errors.email-not-found') })

    const passwordResetToken = await generatePasswordResetToken(dbUser.email!)
    await sendPassorwordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: true, message: t('Feedbacks.Server.Success.reset-email-sent') }
  }),
  createNewPassword: publicProcedure.input(NewPasswordValidator).mutation(async ({ input: { password, token }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Auth' })

    if (!token) throw new TRPCError({ code: 'BAD_REQUEST', message: t('Feedbacks.Server.Errors.psw-reset-token-invalid') })

    const passwordResetToken = await getPasswordResetTokenByToken(token)

    if (!passwordResetToken) throw new TRPCError({ code: 'NOT_FOUND', message: t('Feedbacks.Server.Errors.psw-reset-token-invalid') })

    const hasExpired = new Date(passwordResetToken.expiresAt) < new Date()

    if (hasExpired) throw new TRPCError({ code: 'FORBIDDEN', message: t('Feedbacks.Server.Errors.psw-reset-token-expired') })

    const dbUser = await getUserByEmail(passwordResetToken.email)

    if (!dbUser) throw new TRPCError({ code: 'NOT_FOUND', message: t('Feedbacks.Server.Errors.user-not-found') })

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.update({
      where: { id: dbUser.id },
      data: { password: hashedPassword },
    })

    await db.passwordResetToken.delete({ where: { id: passwordResetToken.id } })

    return { success: true, message: t('Feedbacks.Server.Success.psw-reset') }
  }),
})
