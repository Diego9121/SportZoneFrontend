import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const marcaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  createdAt: z.string(),
})

export type Marca = z.infer<typeof marcaSchema>

export const marcasResponseSchema = apiResponseSchema(
  paginatedSchema(marcaSchema),
)
export const marcaResponseSchema = apiResponseSchema(marcaSchema)

export type MarcasResponse = z.infer<typeof marcasResponseSchema>
