'use client'

import RawMaterialsTable from '@/components/table/rawMaterials/RawMaterialsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useWorkspace } from '@/context/WorkspaceProvider'
import { useTranslations } from 'next-intl'
import { FC } from 'react'

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = ({ }) => {
  const t = useTranslations('Pages.Dashboard')
  const { workspace } = useWorkspace()

  return (
    <Tabs defaultValue='overview'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{t('heading')}</h1>
          <p className='text-muted-foreground'>{workspace?.name || t('sub-heading')}</p>
        </div>
        <TabsList>
          <TabsTrigger value='overview'>{t('Tabs.overview')}</TabsTrigger>
          {workspace?.type === 'PRODUCTION' && <TabsTrigger value='raw-materials'>{t('Tabs.raw-materials')}</TabsTrigger>}
        </TabsList>
      </div>
      <TabsContent value='overview'>overview</TabsContent>
      {workspace?.type === 'PRODUCTION' && (
        <TabsContent value='raw-materials' className='mt-8'>
          <RawMaterialsTable workarea={workspace.workarea} />
        </TabsContent>
      )}
    </Tabs>
  )
}

export default Dashboard
