import { apiClient } from '@/lib/api-client'
import {
  proveedorResponseSchema,
  proveedoresResponseSchema,
} from '@/modules/proveedor/schemas/proveedor.schema'

// Parámetros que mandamos como query string (?page=1&pageSize=20&filter=nike)
export interface GetProveedoresParams {
  page?: number
  pageSize?: number
  filter?: string
}

// Forma del body que espera el backend en POST y PUT
export interface ProveedorPayload {
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
}

export async function getProveedores(params: GetProveedoresParams = {}) {
  // axios convierte el objeto `params` en query string automáticamente
  const { data } = await apiClient.get('/Proveedores', { params })
  return proveedoresResponseSchema.parse(data)
}

export async function createProveedor(payload: ProveedorPayload) {
  const { data } = await apiClient.post('/Proveedores', payload)
  return proveedorResponseSchema.parse(data)
}

export async function updateProveedor(id: number, payload: ProveedorPayload) {
  const { data } = await apiClient.put(`/Proveedores/${id}`, payload)
  return proveedorResponseSchema.parse(data)
}

export async function deleteProveedor(id: number) {
  // DELETE normalmente no devuelve un body útil, por eso no parseamos nada
  await apiClient.delete(`/Proveedores/${id}`)
}
