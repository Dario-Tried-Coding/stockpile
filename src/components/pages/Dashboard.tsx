'use client'

import { useWorkspace } from '@/context/WorkspaceProvider'
import { FC } from 'react'

interface DashboardProps {
  
}

const Dashboard: FC<DashboardProps> = ({ }) => {
  const {workspace} = useWorkspace()
  return <div>Dashboard - {workspace?.name}</div>
}

export default Dashboard