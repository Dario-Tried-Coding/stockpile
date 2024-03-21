'use client'

import { trpc } from '@/lib/server/trpc/trpc'
import { Workarea } from '@prisma/client'
import { FC } from 'react'

interface RawMaterialsTableProps {
  workarea: Workarea
}

const RawMaterialsTable: FC<RawMaterialsTableProps> = ({ workarea }) => {
  const { data } = trpc.production.getRawMaterialsTable.useQuery({ workarea })
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default RawMaterialsTable