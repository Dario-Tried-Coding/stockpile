import { auth } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function UseRoleBasedProtection(role?: UserRole['name']) {
  const session = await auth()

  if (!session || !session.user) return redirect('/auth/login')

  if (!session.user.role) return redirect('/unauthorized')

  if (role && session.user.role?.name !== role) return redirect('/')


  return { user: session.user }
}
