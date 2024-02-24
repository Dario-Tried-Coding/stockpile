import { db } from '@/lib/client/db'

export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    })
    return twoFactorToken
  } catch (error) {
    return null
  }
}

export async function getTwoFactorTokenByToken(token: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    })
    return twoFactorToken
  } catch (error) {
    return null
  }
}
