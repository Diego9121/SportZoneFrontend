import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const varianteSchema = z.object({
  id: z.number(),
  articuloId: z.number(),
  articuloNombre: z.string(),
  articuloCodigo: z.string(),
  tallaUs: z.string().nullable(),
  tallaEu: z.string().nullable(),
  tallaUk: z.string().nullable(),
  tallaCm: z.string().nullable(),
  color: z.string().nullable(),
  codigoBarras: z.string().nullable(),
  stock: z.number(),
  stockMinimo: z.number(),
  stockBajo: z.boolean(),
  precioVenta: z.number(),
  precioCosto: z.number(),
  createdAt: z.string(),
})

export type Variante = z.infer<typeof varianteSchema>

export const variantesResponseSchema = apiResponseSchema(
  paginatedSchema(varianteSchema),
)

export type VariantesResponse = z.infer<typeof variantesResponseSchema>

export const varianteResponseSchema = apiResponseSchema(varianteSchema)

export type VarianteResponse = z.infer<typeof varianteResponseSchema>

// Variante tal como viene en el catálogo del POS (GET /ArticuloVariantes/catalogo):
// trae la imagen del artículo y solo el stock disponible, sin stockMinimo/stockBajo/articuloCodigo.
export const varianteCatalogoSchema = z.object({
  id: z.number(),
  articuloId: z.number(),
  articuloNombre: z.string(),
  articuloImagen: z.string().nullable(),
  tallaUs: z.string().nullable(),
  tallaEu: z.string().nullable(),
  tallaUk: z.string().nullable(),
  tallaCm: z.string().nullable(),
  color: z.string().nullable(),
  codigoBarras: z.string().nullable(),
  stock: z.number(),
  precioVenta: z.number(),
  precioCosto: z.number(),
})

export type VarianteCatalogo = z.infer<typeof varianteCatalogoSchema>

export const varianteCatalogoResponseSchema = apiResponseSchema(
  paginatedSchema(varianteCatalogoSchema),
)

export type VarianteCatalogoResponse = z.infer<typeof varianteCatalogoResponseSchema>
