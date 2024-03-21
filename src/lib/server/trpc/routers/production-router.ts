import { PRODUCTION } from '@/config/roles.config'
import { RawMaterialsTableValidator } from '@/lib/common/validators/production/tables'
import { roleBasedProcedure, router } from '@/lib/server/trpc/init'
import { getTableRawMaterials } from '@/lib/utils/tables/raw-materials-table'
import { TRPCError } from '@trpc/server'
import { getTranslations } from 'next-intl/server'

const productionProcedure = roleBasedProcedure(PRODUCTION)

export const productionRouter = router({
  getRawMaterialsTable: productionProcedure.input(RawMaterialsTableValidator).query(async ({ input: { workarea }, ctx: { locale } }) => {
    const t = await getTranslations({ locale, namespace: 'Pages.Dashboard.Production.Tables.RawMaterials.Server' })

    if (!workarea) throw new TRPCError({ code: 'PARSE_ERROR', message: t('Errors.workarea-not-found') })

    const rawMaterials = await getTableRawMaterials(workarea)
    return rawMaterials
  }),
})
