import { apiClient } from '@/lib/api-client'
import {
  categoriaResponseSchema,
  categoriasResponseSchema,
} from '@/modules/categoria/schemas/categoria.schema'

export interface GetCategoriasParams {
  page?: number
  pageSize?: number
  filter?: string
}

export interface CategoriaPayload {
  nombre: string
  descripcion: string
}

export async function getCategorias(params: GetCategoriasParams = {}) {
  const { data } = await apiClient.get('/Categorias', { params })
  console.log("datos de la URL del GET_Categoria", data)
  return categoriasResponseSchema.parse(data)
}

export async function createCategoria(payload: CategoriaPayload) {
  const { data } = await apiClient.post('/Categorias', payload)
  return categoriaResponseSchema.parse(data)
}

export async function updateCategoria(id: number, payload: CategoriaPayload) {
  const { data } = await apiClient.put(`/Categorias/${id}`, payload)
  return categoriaResponseSchema.parse(data)
}

export async function deleteCategoria(id: number) {
  await apiClient.delete(`/Categorias/${id}`)
}
