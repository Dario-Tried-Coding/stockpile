'use client'

import UserAccountNav from '@/components/UserAccountNav'
import WorkspaceSwitcher from '@/components/WorspaceSwitcher'
import { cn } from '@/lib/utils'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface NavbarProps {
  user?: User | null
}

const Navbar: FC<NavbarProps> = ({ user }) => {
  const t = useTranslations('Navbar')
  const pathname = usePathname()

  return (
    <div className='h-14 border-b'>
      <div className='container flex h-full items-center justify-between px-4'>
        <div className='flex items-center gap-4'>
          <WorkspaceSwitcher user={user} />
          <ul className='flex gap-4 text-sm font-medium text-muted-foreground'>
            {user?.isAdmin && (
              <li>
                <Link href='/users' className={cn({ 'text-foreground': pathname === '/users' })}>
                  {t('Links.users')}
                </Link>
              </li>
            )}
            <li>
              <Link href='/settings' className={cn({ 'text-foreground': pathname === '/settings' })}>
                {t('Links.settings')}
              </Link>
            </li>
          </ul>
        </div>
        <UserAccountNav {...user} />
      </div>
    </div>
  )
}

export default Navbar
