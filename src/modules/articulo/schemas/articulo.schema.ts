import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'
import { varianteSchema } from '@/modules/variante/schemas/variante.schema'

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

// Variante tal como viene anidada dentro del detalle de un artículo
// (sin articuloId/articuloNombre/articuloCodigo/createdAt, son redundantes ahí)
const articuloVarianteResumenSchema = varianteSchema.omit({
  articuloId: true,
  articuloNombre: true,
  articuloCodigo: true,
  createdAt: true,
})

export const articuloDetalleSchema = articuloSchema.extend({
  variantes: z.array(articuloVarianteResumenSchema),
})

export type ArticuloDetalle = z.infer<typeof articuloDetalleSchema>

export const articuloDetalleResponseSchema = apiResponseSchema(articuloDetalleSchema)

export type ArticuloDetalleResponse = z.infer<typeof articuloDetalleResponseSchema>
