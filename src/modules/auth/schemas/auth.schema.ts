import { z } from 'zod'
import { apiResponseSchema } from '@/schemas/api-response.schema'

export const loginDataSchema = z.object({
  token: z.string(),
  usuarioId: z.number(),
  nombre: z.string(),
  email: z.string(),
  rolNombre: z.string(),
  expiraEn: z.string(),
})

export type LoginData = z.infer<typeof loginDataSchema>

export const loginResponseSchema = apiResponseSchema(loginDataSchema)

export type LoginResponse = z.infer<typeof loginResponseSchema>
