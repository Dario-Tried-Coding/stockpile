import { z } from "zod"

export const GetUsersValidator = z.object({
  userType: z.enum(['assigned', 'waiting']),
})
export type TGetUsersValidator = z.infer<typeof GetUsersValidator>

export const UpdateUserValidator = z.object({
  id: z.string(),
  workspaceId: z.string(),
})
export type TUpdateUserValidator = z.infer<typeof UpdateUserValidator>

export const DeleteUserValidator = z.object({
  id: z.string()
})
export type TDeleteUserValidator = z.infer<typeof DeleteUserValidator>

export const DeleteUsersValidator = z.object({
  ids: z.array(z.string())
})
export type TDeleteUsersValidator = z.infer<typeof DeleteUsersValidator>