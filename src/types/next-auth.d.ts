import type { User } from "@auth/core/types";
import type { JWT } from '@auth/core/jwt'

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    isAdmin: boolean
    workspaceId: string | null
  }
}

declare module '@auth/core/types' {
  interface User {
    id: string
    isAdmin: boolean
    workspaceId: string | null
  }
}