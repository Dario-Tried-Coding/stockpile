import { db } from "@/lib/client/db"

export const getTableRawMaterials = async () => {
  const rawMaterials = await db.rawMaterial.findMany({
    include: {
      rawMaterialItems: true
    }
  })

  const extendedRawMaterials = rawMaterials.map(rawMaterial => ({...rawMaterial, totalItems: rawMaterial.rawMaterialItems.reduce((acc, item) => acc + item.quantity, 0)}))
  return extendedRawMaterials
}

export type ExtendedTableRawMaterial = Awaited<ReturnType<typeof getTableRawMaterials>>[number]