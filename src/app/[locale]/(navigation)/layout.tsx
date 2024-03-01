import Hotkeys from '@/components/Hotkeys'
import Navbar from '@/components/Navbar'
import { auth } from '@/lib/server/auth'
import { FC, PropsWithChildren } from 'react'

interface layoutProps extends PropsWithChildren {}

const layout: FC<layoutProps> = async ({children}) => {
  const session = await auth()

  return (
    <main>
      <Hotkeys />
      <Navbar user={session?.user} />
      <div className='container mt-8'>{children}</div>
    </main>
  )
}

export default layout
