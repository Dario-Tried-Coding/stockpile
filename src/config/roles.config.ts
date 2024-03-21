import { WorkspaceType } from "@prisma/client"

export type Role = WorkspaceType | 'ADMIN'

export const SHOP = 'SHOP' as const
export const PRODUCTION = 'PRODUCTION' as const
export const ADMIN = 'ADMIN' as const

export const roles: Role[] = [SHOP, PRODUCTION, ADMIN]