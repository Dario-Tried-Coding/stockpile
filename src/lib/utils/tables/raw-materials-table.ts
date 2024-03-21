import { db } from "@/lib/client/db"

export const getTableRawMaterials = async () => {
  const rawMaterials = await db.rawMaterial.findMany({
    include: {
      rawMaterialItems: true
    }
  })
}