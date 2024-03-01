'use client'

import { FC } from 'react'
import { useHotkeys } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

interface HotkeysProps {}

const Hotkeys: FC<HotkeysProps> = ({ }) => {
  const router = useRouter()
  const session = useSession()

  useHotkeys([
    ['mod+S', () => router.push('/settings')],
    ['mod+shift+Q', () => session.status === 'authenticated' && signOut()],
  ])

  return null
}

export default Hotkeys