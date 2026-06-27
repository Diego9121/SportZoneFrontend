import { apiClient } from '@/lib/api-client'
import { usuarioResponseSchema, usuariosResponseSchema } from '../schemas/usuarioSchema'

// Parámetros que mandamos como query string
export interface GetUsuarioParams {
  page?: number
  pageSize?: number
  filter?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  isPage?: boolean
}

// Forma del body que espera el backend en POST
export interface UsuarioCreatePayload {
  nombre: string
  email: string
  password: string
  rolId: number
}

// Forma del body que espera el backend en PUT (no permite cambiar el password)
export interface UsuarioUpdatePayload {
  nombre: string
  email: string
  rolId: number
  activo: boolean
}

export async function getUsuarios(params: GetUsuarioParams = {}) {
  const { data } = await apiClient.get('/Usuarios', { params })
  return usuariosResponseSchema.parse(data)
}

export async function createUsuario(payload: UsuarioCreatePayload) {
  const { data } = await apiClient.post('/Usuarios', payload)
  return usuarioResponseSchema.parse(data)
}

export async function updateUsuario(id: number, payload: UsuarioUpdatePayload) {
  const { data } = await apiClient.put(`/Usuarios/${id}`, payload)
  return usuarioResponseSchema.parse(data)
}

export async function deleteUsuarios(id: number) {
  // DELETE no devuelve `data`, solo { success, message }, por eso no parseamos nada
  await apiClient.delete(`/Usuarios/${id}`)
}
