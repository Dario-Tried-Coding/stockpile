import { PRODUCTION } from '@/config/roles.config'
import { roleBasedProcedure, router } from '@/lib/server/trpc/init'
import { getTableRawMaterials } from '@/lib/utils/tables/raw-materials-table'

const productionProcedure = roleBasedProcedure(PRODUCTION)

export const productionRouter = router({
  getRawMaterials: productionProcedure.query(async () => {
    const rawMaterials = await getTableRawMaterials()
    return rawMaterials
  }),
})
