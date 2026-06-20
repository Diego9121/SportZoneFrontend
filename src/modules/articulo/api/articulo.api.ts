import { apiClient } from '@/lib/api-client'
import {
  articuloDetalleResponseSchema,
  articuloResponseSchema,
  articulosResponseSchema,
} from '@/modules/articulo/schemas/articulo.schema'

// Parámetros que mandamos como query string (?page=1&pageSize=20&filter=nike)
export interface GetArticulosParams {
  page?: number
  pageSize?: number
  filter?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  isPage?: boolean
}

// Forma del body que espera el backend en POST y PUT
export interface ArticuloPayload {
  categoriaId: number
  marcaId: number
  codigo: string
  nombre: string
  descripcion: string
  imagen: string
}

export async function getArticulos(params: GetArticulosParams = {}) {
  const { data } = await apiClient.get('/Articulos', { params })
  return articulosResponseSchema.parse(data)
}

export async function getArticuloById(id: number) {
  const { data } = await apiClient.get(`/Articulos/${id}`)
  return articuloDetalleResponseSchema.parse(data)
}

export async function createArticulo(payload: ArticuloPayload) {
  const { data } = await apiClient.post('/Articulos', payload)
  return articuloResponseSchema.parse(data)
}

export async function updateArticulo(id: number, payload: ArticuloPayload) {
  const { data } = await apiClient.put(`/Articulos/${id}`, payload)
  return articuloResponseSchema.parse(data)
}

export async function deleteArticulo(id: number) {
  // DELETE normalmente no devuelve un body útil, por eso no parseamos nada
  await apiClient.delete(`/Articulos/${id}`)
}
