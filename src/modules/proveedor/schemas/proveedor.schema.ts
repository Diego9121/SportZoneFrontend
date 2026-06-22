import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const proveedorSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  contacto: z.string().nullable(),
  telefono: z.string().nullable(),
  email: z.string().nullable(),
  direccion: z.string().nullable(),
  createdAt: z.string(),
})

export type Proveedor = z.infer<typeof proveedorSchema>

export const proveedoresResponseSchema = apiResponseSchema(
  paginatedSchema(proveedorSchema),
)

export type ProveedoresResponse = z.infer<typeof proveedoresResponseSchema>

export const proveedorResponseSchema = apiResponseSchema(proveedorSchema)

export type ProveedorResponse = z.infer<typeof proveedorResponseSchema>
