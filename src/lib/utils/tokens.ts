import { db } from '@/lib/client/db'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { getVerificationTokenByEmail } from '@/lib/utils/db/verification-token'
import { getPasswordResetTokenByEmail } from '@/lib/utils/db/password-reset-token'
import { getTwoFactorTokenByEmail } from '@/lib/utils/db/2fa-token'

export async function generateVerificationToken(email: string) {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  })

  return verificationToken
}

export async function generatePasswordResetToken(email: string) {
  const token = uuidv4()
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    })
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: { email, token, expiresAt },
  })

  return passwordResetToken
}

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000)

  const existingToken = await getTwoFactorTokenByEmail(email)

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: { email, token, expiresAt },
  })

  return twoFactorToken
}
