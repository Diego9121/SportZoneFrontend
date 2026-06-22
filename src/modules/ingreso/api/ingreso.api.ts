import { apiClient } from '@/lib/api-client'
import {
  ingresoResponseSchema,
  ingresosResponseSchema,
} from '@/modules/ingreso/schemas/ingreso.schema'

// Parámetros que mandamos como query string (?page=1&pageSize=20&filter=...)
export interface GetIngresosParams {
  page?: number
  pageSize?: number
  filter?: string
}

// Forma del body que espera el backend en POST
export interface IngresoDetallePayload {
  varianteId: number
  cantidad: number
  precioCosto: number
}

export interface IngresoPayload {
  proveedorId: number
  numeroDoc: string
  observacion: string | null
  detalles: IngresoDetallePayload[]
}

export async function getIngresos(params: GetIngresosParams = {}) {
  const { data } = await apiClient.get('/Ingresos', { params })
  return ingresosResponseSchema.parse(data)
}

export async function createIngreso(payload: IngresoPayload) {
  const { data } = await apiClient.post('/Ingresos', payload)
  return ingresoResponseSchema.parse(data)
}
