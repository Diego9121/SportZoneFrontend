import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const rolSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  createdAt: z.string(),
})

export type Rol = z.infer<typeof rolSchema>

export const rolesResponseSchema = apiResponseSchema(
  paginatedSchema(rolSchema),
)

export type RolesResponse = z.infer<typeof rolesResponseSchema>
