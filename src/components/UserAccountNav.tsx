import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { LogOut, User as UserIcon } from 'lucide-react'
import { User } from 'next-auth'
import Link from 'next/link'
import { FC } from 'react'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

interface UserAccountNavProps extends Pick<User, 'image' | 'name' | 'email'> {}

const UserAccountNav: FC<UserAccountNavProps> = ({ image, email, name }) => {
  const linksT = useTranslations('Navbar.Links')
  const authT = useTranslations('Auth')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-full'>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback>
            <UserIcon className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-1'>
            <p className='truncate text-sm font-medium leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/settings'>
              {linksT('settings')}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(e) => {
            e.preventDefault()
            signOut()
          }}
        >
          {authT('logout')}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
