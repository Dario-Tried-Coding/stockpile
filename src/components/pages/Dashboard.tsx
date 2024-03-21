'use client'

import { useWorkspace } from '@/context/WorkspaceProvider'
import { trpc } from '@/lib/server/trpc/trpc'
import { FC } from 'react'

interface DashboardProps {
  
}

const Dashboard: FC<DashboardProps> = ({ }) => {
  const { workspace } = useWorkspace()
  const {data} = trpc.production.getRawMaterials.useQuery()
  return <div>Dashboard - {workspace?.name} - <pre>{JSON.stringify(data, null, 2)}</pre></div>
}

export default Dashboard