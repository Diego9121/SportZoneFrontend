import { apiClient } from '@/lib/api-client'
import {
  clienteResponseSchema,
  clientesResponseSchema,
} from '@/modules/cliente/schemas/cliente.schema'

// Parámetros que mandamos como query string (?page=1&pageSize=20&filter=nike)
export interface GetClientesParams {
  page?: number
  pageSize?: number
  filter?: string
}

// Forma del body que espera el backend en POST y PUT
export interface ClientePayload {
  tipoDocumento: string
  documento: string
  nombre: string
  telefono: string
  email: string
  direccion: string
}

export async function getClientes(params: GetClientesParams = {}) {
  // axios convierte el objeto `params` en query string automáticamente
  const { data } = await apiClient.get('/Clientes', { params })
  return clientesResponseSchema.parse(data)
}

export async function createCliente(payload: ClientePayload) {
  const { data } = await apiClient.post('/Clientes', payload)
  return clienteResponseSchema.parse(data)
}

export async function updateCliente(id: number, payload: ClientePayload) {
  const { data } = await apiClient.put(`/Clientes/${id}`, payload)
  return clienteResponseSchema.parse(data)
}

export async function deleteCliente(id: number) {
  // DELETE normalmente no devuelve un body útil, por eso no parseamos nada
  await apiClient.delete(`/Clientes/${id}`)
}
