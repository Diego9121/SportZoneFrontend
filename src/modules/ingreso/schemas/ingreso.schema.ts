import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const ingresoDetalleSchema = z.object({
  id: z.number(),
  varianteId: z.number(),
  varianteDescripcion: z.string(),
  cantidad: z.number(),
  precioCosto: z.number(),
  subtotal: z.number(),
})

export type IngresoDetalle = z.infer<typeof ingresoDetalleSchema>

export const ingresoSchema = z.object({
  id: z.number(),
  proveedorId: z.number(),
  proveedorNombre: z.string(),
  numeroDoc: z.string().nullable(),
  total: z.number(),
  observacion: z.string().nullable(),
  detalles: z.array(ingresoDetalleSchema),
  createdAt: z.string(),
})

export type Ingreso = z.infer<typeof ingresoSchema>

export const ingresosResponseSchema = apiResponseSchema(
  paginatedSchema(ingresoSchema),
)

export type IngresosResponse = z.infer<typeof ingresosResponseSchema>

export const ingresoResponseSchema = apiResponseSchema(ingresoSchema)

export type IngresoResponse = z.infer<typeof ingresoResponseSchema>
