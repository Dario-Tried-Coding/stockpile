import { logout } from '@/actions/logout'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { FC, HTMLAttributes } from 'react'

interface LogoutBtnProps extends HTMLAttributes<HTMLButtonElement> {}

const LogoutBtn: FC<LogoutBtnProps> = ({ className, ...rest }) => {
  const t = useTranslations('Auth')
  return <form action={logout}><Button variant='ghost' type='submit' className={cn('', className)} {...rest}>{t('logout')}</Button></form>
}

export default LogoutBtn