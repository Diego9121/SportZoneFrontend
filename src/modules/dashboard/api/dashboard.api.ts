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

// anio/mes son opcionales: si no se mandan, el backend usa el mes actual.
export async function getDashboardVentasMes() {
  const { data } = await apiClient.get('/Dashboard/ventas-mes')
  return dashboardVentasMesResponseSchema.parse(data)
}

export async function getDashboardComprasMes() {
  const { data } = await apiClient.get('/Dashboard/compras-mes')
  return dashboardComprasMesResponseSchema.parse(data)
}

export async function getDashboardMargenGananciaMes() {
  const { data } = await apiClient.get('/Dashboard/margen-ganancia-mes')
  return dashboardMargenGananciaMesResponseSchema.parse(data)
}

export async function getDashboardParesVendidosMes() {
  const { data } = await apiClient.get('/Dashboard/pares-vendidos-mes')
  return dashboardParesVendidosMesResponseSchema.parse(data)
}

export async function getDashboardVentasPorCategoriaMes() {
  const { data } = await apiClient.get('/Dashboard/ventas-por-categoria-mes')
  return dashboardVentasPorCategoriaResponseSchema.parse(data)
}

export async function getDashboardTopProductosMes(top = 5) {
  const { data } = await apiClient.get('/Dashboard/top-productos-mes', { params: { top } })
  return dashboardTopProductosResponseSchema.parse(data)
}

export async function getDashboardComprasVsVentasMes() {
  const { data } = await apiClient.get('/Dashboard/compras-vs-ventas-mes')
  return dashboardComprasVsVentasResponseSchema.parse(data)
}
