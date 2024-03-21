'use client'

import RawMaterialsTable from '@/components/table/rawMaterials/RawMaterialsTable'
import { useWorkspace } from '@/context/WorkspaceProvider'
import { FC } from 'react'

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = ({}) => {
  const { workspace } = useWorkspace()

  return (
    <div>
      Dashboard - {workspace?.name} - {workspace?.type === 'PRODUCTION' && <RawMaterialsTable workarea={workspace.workarea} />}
    </div>
  )
}

export default Dashboard
