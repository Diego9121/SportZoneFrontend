import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const categoriaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  createdAt: z.string(),
})

export type Categoria = z.infer<typeof categoriaSchema>

export const categoriasResponseSchema = apiResponseSchema(
  paginatedSchema(categoriaSchema),
)

export type CategoriasResponse = z.infer<typeof categoriasResponseSchema>

export const categoriaResponseSchema = apiResponseSchema(categoriaSchema)

export type CategoriaResponse = z.infer<typeof categoriaResponseSchema>
