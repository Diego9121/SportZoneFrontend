import { z } from 'zod'
import { apiResponseSchema } from '@/schemas/api-response.schema'

export const dashboardVentasMesSchema = z.object({
  anio: z.number(),
  mes: z.number(),
  totalMesActual: z.number(),
  totalMesAnterior: z.number(),
  porcentajeCambio: z.number(),
})

export type DashboardVentasMes = z.infer<typeof dashboardVentasMesSchema>

export const dashboardVentasMesResponseSchema = apiResponseSchema(dashboardVentasMesSchema)

export const dashboardComprasMesSchema = z.object({
  anio: z.number(),
  mes: z.number(),
  totalMesActual: z.number(),
  totalMesAnterior: z.number(),
  porcentajeCambio: z.number(),
})

export type DashboardComprasMes = z.infer<typeof dashboardComprasMesSchema>

export const dashboardComprasMesResponseSchema = apiResponseSchema(dashboardComprasMesSchema)

export const dashboardMargenGananciaMesSchema = z.object({
  anio: z.number(),
  mes: z.number(),
  totalVendido: z.number(),
  totalCosto: z.number(),
  gananciaBruta: z.number(),
  margenPorcentaje: z.number(),
})

export type DashboardMargenGananciaMes = z.infer<typeof dashboardMargenGananciaMesSchema>

export const dashboardMargenGananciaMesResponseSchema = apiResponseSchema(
  dashboardMargenGananciaMesSchema,
)

export const dashboardParesVendidosMesSchema = z.object({
  anio: z.number(),
  mes: z.number(),
  paresVendidos: z.number(),
})

export type DashboardParesVendidosMes = z.infer<typeof dashboardParesVendidosMesSchema>

export const dashboardParesVendidosMesResponseSchema = apiResponseSchema(
  dashboardParesVendidosMesSchema,
)

export const dashboardVentasPorCategoriaSchema = z.object({
  categoriaId: z.number(),
  categoriaNombre: z.string(),
  total: z.number(),
  porcentaje: z.number(),
})

export type DashboardVentasPorCategoria = z.infer<typeof dashboardVentasPorCategoriaSchema>

export const dashboardVentasPorCategoriaResponseSchema = apiResponseSchema(
  z.array(dashboardVentasPorCategoriaSchema),
)

export const dashboardTopProductoSchema = z.object({
  varianteId: z.number(),
  articuloId: z.number(),
  articuloNombre: z.string(),
  varianteDescripcion: z.string(),
  cantidadVendida: z.number(),
  totalVendido: z.number(),
  gananciaGenerada: z.number(),
})

export type DashboardTopProducto = z.infer<typeof dashboardTopProductoSchema>

export const dashboardTopProductosResponseSchema = apiResponseSchema(
  z.array(dashboardTopProductoSchema),
)

export const dashboardSerieDiariaSchema = z.object({
  fecha: z.string(),
  totalVentas: z.number(),
  totalCompras: z.number(),
})

export type DashboardSerieDiaria = z.infer<typeof dashboardSerieDiariaSchema>

export const dashboardComprasVsVentasResponseSchema = apiResponseSchema(
  z.array(dashboardSerieDiariaSchema),
)
