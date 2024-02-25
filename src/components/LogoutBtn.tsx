import { logout } from '@/actions/logout'
import { FC } from 'react'

interface LogoutBtnProps {}

const LogoutBtn: FC<LogoutBtnProps> = ({ }) => {
  return <form action={logout}><button type='submit'>Esci</button></form>
}

export default LogoutBtn