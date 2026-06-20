import { apiClient } from '@/lib/api-client'
import {
  varianteResponseSchema,
  variantesResponseSchema,
} from '@/modules/variante/schemas/variante.schema'

// Parámetros que mandamos como query string
export interface GetVariantesParams {
  page?: number
  pageSize?: number
  filter?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  articuloId?: number
  isPage?: boolean
}

// Forma del body que espera el backend en POST
export interface VarianteCreatePayload {
  articuloId: number
  tallaUs: string
  tallaEu: string
  tallaUk: string
  tallaCm: string
  color: string
  codigoBarras: string
  stock: number
  stockMinimo: number
  precioVenta: number
  precioCosto: number
}

// Forma del body que espera el backend en PUT (no permite cambiar articuloId ni stock)
export interface VarianteUpdatePayload {
  tallaUs: string
  tallaEu: string
  tallaUk: string
  tallaCm: string
  color: string
  codigoBarras: string
  stockMinimo: number
  precioVenta: number
  precioCosto: number
}

export async function getVariantes(params: GetVariantesParams = {}) {
  const { data } = await apiClient.get('/ArticuloVariantes', { params })
  return variantesResponseSchema.parse(data)
}

export async function getVarianteByCodigoBarras(codigo: string) {
  const { data } = await apiClient.get(`/ArticuloVariantes/codigo-barras/${codigo}`)
  return varianteResponseSchema.parse(data)
}

export async function createVariante(payload: VarianteCreatePayload) {
  const { data } = await apiClient.post('/ArticuloVariantes', payload)
  return varianteResponseSchema.parse(data)
}

export async function updateVariante(id: number, payload: VarianteUpdatePayload) {
  const { data } = await apiClient.put(`/ArticuloVariantes/${id}`, payload)
  return varianteResponseSchema.parse(data)
}

export async function deleteVariante(id: number) {
  // DELETE no devuelve `data`, solo { success, message }, por eso no parseamos nada
  await apiClient.delete(`/ArticuloVariantes/${id}`)
}
