import type { User } from "@auth/core/types";
import type { JWT } from '@auth/core/jwt'

declare module '@auth/core/jwt' {
  interface JWT {
    isAdmin: boolean
  }
}

declare module '@auth/core/types' {
  interface User {
    isAdmin: boolean
  }
}