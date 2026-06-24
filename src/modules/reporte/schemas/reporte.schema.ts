import { z } from 'zod'
import { apiResponseSchema } from '@/schemas/api-response.schema'

export const reporteVentasResumenSchema = z.object({
  desde: z.string().nullable(),
  hasta: z.string().nullable(),
  cantidadVentas: z.number(),
  totalVendido: z.number(),
  totalDescuentos: z.number(),
  totalCosto: z.number(),
  gananciaBruta: z.number(),
  ticketPromedio: z.number(),
})

export type ReporteVentasResumen = z.infer<typeof reporteVentasResumenSchema>

export const reporteDetalleItemSchema = z.object({
  nombre: z.string(),
  cantidad: z.number(),
  precioUnitario: z.number(),
  total: z.number(),
})

export type ReporteDetalleItem = z.infer<typeof reporteDetalleItemSchema>

export const reporteVentaItemSchema = z.object({
  id: z.number(),
  numeroDoc: z.string().nullable(),
  tipoComprobante: z.string(),
  clienteNombre: z.string().nullable(),
  estado: z.string(),
  total: z.number(),
  descuento: z.number(),
  costo: z.number(),
  ganancia: z.number(),
  createdAt: z.string(),
  detalles: z.array(reporteDetalleItemSchema),
})

export type ReporteVentaItem = z.infer<typeof reporteVentaItemSchema>

export const reporteVentasDataSchema = z.object({
  resumen: reporteVentasResumenSchema,
  ventas: z.array(reporteVentaItemSchema),
})

export type ReporteVentasData = z.infer<typeof reporteVentasDataSchema>

export const reporteVentasResponseSchema = apiResponseSchema(reporteVentasDataSchema)

export type ReporteVentasResponse = z.infer<typeof reporteVentasResponseSchema>

export const reporteComprasResumenSchema = z.object({
  desde: z.string().nullable(),
  hasta: z.string().nullable(),
  cantidadIngresos: z.number(),
  totalComprado: z.number(),
  compraPromedio: z.number(),
})

export type ReporteComprasResumen = z.infer<typeof reporteComprasResumenSchema>

export const reporteCompraItemSchema = z.object({
  id: z.number(),
  numeroDoc: z.string().nullable(),
  proveedorNombre: z.string().nullable(),
  total: z.number(),
  createdAt: z.string(),
  detalles: z.array(reporteDetalleItemSchema),
})

export type ReporteCompraItem = z.infer<typeof reporteCompraItemSchema>

export const reporteComprasDataSchema = z.object({
  resumen: reporteComprasResumenSchema,
  compras: z.array(reporteCompraItemSchema),
})

export type ReporteComprasData = z.infer<typeof reporteComprasDataSchema>

export const reporteComprasResponseSchema = apiResponseSchema(reporteComprasDataSchema)

export type ReporteComprasResponse = z.infer<typeof reporteComprasResponseSchema>
