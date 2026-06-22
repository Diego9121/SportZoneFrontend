import { apiClient } from '@/lib/api-client'
import {
  ventaResponseSchema,
  ventasResponseSchema,
} from '@/modules/venta/schemas/venta.schema'

// Parámetros que mandamos como query string
export interface GetVentasParams {
  page?: number
  pageSize?: number
  filter?: string
}

// Forma del body que espera el backend en POST
export interface VentaDetallePayload {
  varianteId: number
  cantidad: number
  descuento: number
}

export interface VentaPayload {
  clienteId: number
  tipoComprobante: string
  observacion: string | null
  detalles: VentaDetallePayload[]
}

export async function getVentas(params: GetVentasParams = {}) {
  const { data } = await apiClient.get('/Ventas', { params })
  return ventasResponseSchema.parse(data)
}

export async function getVentaById(id: number) {
  const { data } = await apiClient.get(`/Ventas/${id}`)
  return ventaResponseSchema.parse(data)
}

export async function createVenta(payload: VentaPayload) {
  const { data } = await apiClient.post('/Ventas', payload)
  return ventaResponseSchema.parse(data)
}
