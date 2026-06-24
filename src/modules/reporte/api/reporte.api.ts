import { apiClient } from '@/lib/api-client'
import {
  reporteComprasResponseSchema,
  reporteVentasResponseSchema,
} from '@/modules/reporte/schemas/reporte.schema'

export interface GetReporteParams {
  desde?: string
  hasta?: string
}

export async function getReporteVentas(params: GetReporteParams = {}) {
  const { data } = await apiClient.get('/Reportes/ventas', { params })
  return reporteVentasResponseSchema.parse(data)
}

export async function getReporteCompras(params: GetReporteParams = {}) {
  const { data } = await apiClient.get('/Reportes/compras', { params })
  return reporteComprasResponseSchema.parse(data)
}
