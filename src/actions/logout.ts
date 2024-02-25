'use server'

import { signOut } from "@/lib/server/auth"

export const logout = async () => await signOut()