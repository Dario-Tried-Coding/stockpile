import { z } from "zod"

export const GetUsersValidator = z.object({
  userType: z.enum(['assigned', 'waiting']),
})
export type TGetUsersValidator = z.infer<typeof GetUsersValidator>

export const UpdateUserValidator = z.object({
  id: z.string(),
  workspaceIds: z.array(z.string()),
})
export type TUpdateUserValidator = z.infer<typeof UpdateUserValidator>