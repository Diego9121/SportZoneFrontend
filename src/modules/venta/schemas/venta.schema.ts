import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const ventaDetalleSchema = z.object({
  id: z.number(),
  varianteId: z.number(),
  varianteDescripcion: z.string(),
  cantidad: z.number(),
  precioUnitario: z.number(),
  // El listado no trae este campo en cada línea, solo el detalle por id.
  precioCosto: z.number().optional(),
  descuento: z.number(),
  subtotal: z.number(),
})

export type VentaDetalle = z.infer<typeof ventaDetalleSchema>

export const ventaSchema = z.object({
  id: z.number(),
  clienteId: z.number().nullable(),
  clienteNombre: z.string().nullable(),
  numeroDoc: z.string().nullable(),
  tipoComprobante: z.string(),
  subtotal: z.number(),
  descuento: z.number(),
  total: z.number(),
  estado: z.string(),
  observacion: z.string().nullable(),
  detalles: z.array(ventaDetalleSchema),
  createdAt: z.string(),
})

export type Venta = z.infer<typeof ventaSchema>

export const ventasResponseSchema = apiResponseSchema(
  paginatedSchema(ventaSchema),
)

export type VentasResponse = z.infer<typeof ventasResponseSchema>

export const ventaResponseSchema = apiResponseSchema(ventaSchema)

export type VentaResponse = z.infer<typeof ventaResponseSchema>
