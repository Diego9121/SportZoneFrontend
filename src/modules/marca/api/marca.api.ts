import { apiClient } from '@/lib/api-client'
import {
  marcaResponseSchema,
  marcasResponseSchema,
} from '@/modules/marca/schemas/marca.schema'

// Parámetros que mandamos como query string (?page=1&pageSize=20&filter=nike)
export interface GetMarcasParams {
  page?: number
  pageSize?: number
  filter?: string
}

// Forma del body que espera el backend en POST y PUT
export interface MarcaPayload {
  nombre: string
  descripcion: string
}

export async function getMarcas(params: GetMarcasParams = {}) {
  // axios convierte el objeto `params` en query string automáticamente
  const { data } = await apiClient.get('/Marcas', { params })
  return marcasResponseSchema.parse(data)
}

export async function createMarca(payload: MarcaPayload) {
  const { data } = await apiClient.post('/Marcas', payload)
  return marcaResponseSchema.parse(data)
}

export async function updateMarca(id: number, payload: MarcaPayload) {
  const { data } = await apiClient.put(`/Marcas/${id}`, payload)
  return marcaResponseSchema.parse(data)
}

export async function deleteMarca(id: number) {
  // DELETE normalmente no devuelve un body útil, por eso no parseamos nada
  await apiClient.delete(`/Marcas/${id}`)
}
