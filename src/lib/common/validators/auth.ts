import { z } from 'zod'

export const SignInValidator = z.object({
  email: z.string().email({ message: 'Email necessaria' }).toLowerCase(),
  password: z.string().min(1, { message: 'Password deve avere almeno 1 carattere' }),
  code: z
    .union([z.string().length(0), z.string().min(6)])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
})
export type TSignInValidator = z.infer<typeof SignInValidator>

export const RegisterValidator = z.object({
  email: z.string().email({ message: 'Email necessaria' }).toLowerCase(),
  password: z.string().min(6, { message: 'Password deve avere almeno 6 caratteri' }),
  name: z.string().min(3, { message: 'Nome deve avere almeno 3 caratteri' }),
})
export type TRegisterValidator = z.infer<typeof RegisterValidator>

export const PasswordResetValidator = z.object({
  email: z.string().email({ message: 'Email necessaria' }).toLowerCase(),
})
export type TPasswordResetValidator = z.infer<typeof PasswordResetValidator>

export const NewPasswordValidator = z
  .object({
    password: z.string().min(6, { message: 'Password deve avere almeno 6 caratteri' }),
    confirmPassword: z.string().min(6, { message: 'Password deve avere almeno 6 caratteri' }),
    token: z.string().nullish(),
  })
  .refine((data) => data.password === data.confirmPassword, { message: 'Le password non coincidono' })
export type TNewPasswordValidator = z.infer<typeof NewPasswordValidator>
