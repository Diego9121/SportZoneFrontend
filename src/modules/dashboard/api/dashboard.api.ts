import { apiClient } from '@/lib/api-client'
import {
  dashboardComprasMesResponseSchema,
  dashboardComprasVsVentasResponseSchema,
  dashboardMargenGananciaMesResponseSchema,
  dashboardParesVendidosMesResponseSchema,
  dashboardTopProductosResponseSchema,
  dashboardVentasMesResponseSchema,
  dashboardVentasPorCategoriaResponseSchema,
} from '@/modules/dashboard/schemas/dashboard.schema'

export async function getDashboardVentasMes(anio: number, mes: number) {
  const { data } = await apiClient.get('/Dashboard/ventas-mes', { params: { anio, mes } })
  return dashboardVentasMesResponseSchema.parse(data)
}

export async function getDashboardComprasMes(anio: number, mes: number) {
  const { data } = await apiClient.get('/Dashboard/compras-mes', { params: { anio, mes } })
  return dashboardComprasMesResponseSchema.parse(data)
}

export async function getDashboardMargenGananciaMes(anio: number, mes: number) {
  const { data } = await apiClient.get('/Dashboard/margen-ganancia-mes', { params: { anio, mes } })
  return dashboardMargenGananciaMesResponseSchema.parse(data)
}

export async function getDashboardParesVendidosMes(anio: number, mes: number) {
  const { data } = await apiClient.get('/Dashboard/pares-vendidos-mes', { params: { anio, mes } })
  return dashboardParesVendidosMesResponseSchema.parse(data)
}

export async function getDashboardVentasPorCategoriaMes(anio: number, mes: number) {
  const { data } = await apiClient.get('/Dashboard/ventas-por-categoria-mes', { params: { anio, mes } })
  return dashboardVentasPorCategoriaResponseSchema.parse(data)
}

export async function getDashboardTopProductosMes(anio: number, mes: number, top = 5) {
  const { data } = await apiClient.get('/Dashboard/top-productos-mes', { params: { anio, mes, top } })
  return dashboardTopProductosResponseSchema.parse(data)
}

export async function getDashboardComprasVsVentasMes(anio: number, mes: number) {
  const { data } = await apiClient.get('/Dashboard/compras-vs-ventas-mes', { params: { anio, mes } })
  return dashboardComprasVsVentasResponseSchema.parse(data)
}
