'use client'

import UseUsersTable from '@/hooks/tables/use-users-table'
import { FC, PropsWithChildren, createContext, useContext } from 'react'

type UsersTableContext = ReturnType<typeof UseUsersTable>['context']
const UsersTableContext = createContext<UsersTableContext | null>(null)

interface UsersTableProviderProps extends PropsWithChildren {
  context: UsersTableContext
}
export const UsersTableProvider: FC<UsersTableProviderProps> = ({ context, children }) => {
  return <UsersTableContext.Provider value={context}>{children}</UsersTableContext.Provider>
}

export const useUsersTableContext = () => {
  const context = useContext(UsersTableContext)
  if (!context) throw new Error('useUsersTable must be used within a UsersTableProvider')
  return context
}