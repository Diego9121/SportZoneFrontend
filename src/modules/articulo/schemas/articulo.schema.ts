import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const articuloSchema = z.object({
  id: z.number(),
  categoriaId: z.number(),
  categoriaNombre: z.string(),
  marcaId: z.number(),
  marcaNombre: z.string(),
  codigo: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  imagen: z.string().nullable(),
  totalVariantes: z.number(),
  stockTotal: z.number(),
  createdAt: z.string(),
})

export type Articulo = z.infer<typeof articuloSchema>

export const articulosResponseSchema = apiResponseSchema(
  paginatedSchema(articuloSchema),
)

export type ArticulosResponse = z.infer<typeof articulosResponseSchema>

export const articuloResponseSchema = apiResponseSchema(articuloSchema)

export type ArticuloResponse = z.infer<typeof articuloResponseSchema>
