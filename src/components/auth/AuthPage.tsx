import LoginForm from '@/components/auth/LoginForm'
import NewPasswordForm from '@/components/auth/NewPasswordForm'
import RegisterForm from '@/components/auth/RegisterForm'
import ResetEmailForm from '@/components/auth/ResetEmailForm'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Paths } from '@/types/helpers'
import { useTranslations } from 'next-intl'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { AnchorHTMLAttributes, FC, ForwardRefExoticComponent, HTMLAttributes, PropsWithChildren, RefAttributes, forwardRef } from 'react'
import lodash from 'lodash'

const I18N_NAMESPACE = 'Auth' as const

interface AuthPageProps extends PropsWithChildren {}
const AuthPage: FC<AuthPageProps> = ({ children }) => {
  return <>{children}</>
}

// Compound components ----------------------------------------------------------------------------------
interface AuthPage extends ForwardRefExoticComponent<AuthPageProps & RefAttributes<HTMLDivElement>> {
  Forms: {
    Login: typeof LoginForm
    Register: typeof RegisterForm
    ResetEmail: typeof ResetEmailForm
    NewPassword: typeof NewPasswordForm
  }
  Heading: typeof Heading
  Footnote: typeof Footnote
  Link: typeof Link
  Policy: typeof Policy
}

// Heading
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  text: Paths<Messages[typeof I18N_NAMESPACE]>
}
const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({ text, className, ...rest }, ref) => {
  const t = useTranslations(I18N_NAMESPACE)

  return (
    <h1 className={cn('text-2xl font-semibold tracking-tighter', className)} ref={ref} {...rest}>
      {t(text)}
    </h1>
  )
})

// Footnote
interface FootnoteProps extends HTMLAttributes<HTMLParagraphElement> {
  text: Paths<Messages[typeof I18N_NAMESPACE]>
}
const Footnote = forwardRef<HTMLParagraphElement, FootnoteProps>(({ text, className, ...rest }, ref) => {
  const t = useTranslations(I18N_NAMESPACE)

  return (
    <p className={cn('mt-2 text-sm text-base-500', className)} ref={ref} {...rest}>
      {t(text)}
    </p>
  )
})

// Policy
interface PolicyProps extends HTMLAttributes<HTMLParagraphElement> {}
const Policy = forwardRef<HTMLParagraphElement, PolicyProps>(({ className, ...rest }, ref) => {
  const t = useTranslations('Auth')

  return (
    <p className={cn('mt-6 text-sm leading-6 text-base-500', className)} ref={ref} {...rest}>
      {t.rich('policy', {
        termsLink: (chunk) => (
          <NextLink href='/terms-of-service' className='underline underline-offset-2'>
            {chunk}
          </NextLink>
        ),
        privacyLink: (chunk) => (
          <NextLink href='/privacy' className='underline underline-offset-2'>
            {chunk}
          </NextLink>
        ),
      })}
    </p>
  )
})

// Link
interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps | 'children'>,
    NextLinkProps,
    Omit<RefAttributes<HTMLAnchorElement>, 'children'> {
  text: Paths<Messages[typeof I18N_NAMESPACE]>
}
const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ text, className, ...rest }, ref) => {
  const t = useTranslations(I18N_NAMESPACE)

  return (
    <NextLink
      className={cn(buttonVariants({ variant: 'ghost', className: 'absolute right-5 top-5 lg:right-20 lg:top-10' }), className)}
      ref={ref}
      {...rest}
    >
      {t(text)}
    </NextLink>
  )
})

export default lodash.merge(AuthPage, {
  Forms: {
    Login: LoginForm,
    Register: RegisterForm,
    ResetEmail: ResetEmailForm,
    NewPassword: NewPasswordForm,
  },
  Heading,
  Footnote,
  Link,
  Policy,
}) as AuthPage
