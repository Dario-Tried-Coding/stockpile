import PasswordResetEmail from '@/components/emails/PasswordResetEmail'
import TwoFactorTokenEmail from '@/components/emails/TwoFactorTokenEmail'
import VerificationEmail from '@/components/emails/VerificationEmail'
import { resend } from '@/lib/client/resend'

export async function sendVerificationEmail(email: string, token: string) {
  return await resend.emails.send({
    from: 'Stockpile <onboarding@resend.dev>',
    to: email,
    subject: 'Verifica la tua email',
    text: 'Test',
    react: VerificationEmail({ token }),
  })
}

export async function sendPassorwordResetEmail(email: string, token: string) {
  return await resend.emails.send({
    from: 'Stockpile <onboarding@resend.dev>',
    to: email,
    subject: 'Recupero password',
    text: 'Test',
    react: PasswordResetEmail({ token })
  })
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  return await resend.emails.send({
    from: 'Stockpile <onboarding@resend.dev>',
    to: email,
    subject: 'Codice di verifica',
    text: 'Test',
    react: TwoFactorTokenEmail({ token })
  })
}