import { apiClient } from '@/lib/api-client'
import { rolesResponseSchema } from '@/modules/roles/schemas/rol.schema'

// Parámetros que mandamos como query string
export interface GetRolesParams {
  page?: number
  pageSize?: number
}

export async function getRoles(params: GetRolesParams = {}) {
  const { data } = await apiClient.get('/Roles', { params })
  return rolesResponseSchema.parse(data)
}
