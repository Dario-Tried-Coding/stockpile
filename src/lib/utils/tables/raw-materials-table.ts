import { db } from '@/lib/client/db'
import { Workarea } from '@prisma/client'

export const getTableRawMaterials = async (workarea: Workarea) => {
  const rawMaterials = await db.rawMaterial.findMany({
    where: { workareas: { has: workarea } },
    include: {
      rawMaterialItems: { where: { workarea } },
    },
  })

  const extendedRawMaterials = rawMaterials.map((rawMaterial) => ({
    ...rawMaterial,
    totalItems: rawMaterial.rawMaterialItems.reduce((acc, item) => acc + item.quantity, 0),
  }))

  const filteredRawMaterials = extendedRawMaterials.filter((rawMaterial) => rawMaterial.totalItems > 0)

  return filteredRawMaterials
}

export type ExtendedTableRawMaterial = Awaited<ReturnType<typeof getTableRawMaterials>>[number]
