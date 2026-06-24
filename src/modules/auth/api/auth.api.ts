import { apiClient } from '@/lib/api-client'
import { loginResponseSchema } from '@/modules/auth/schemas/auth.schema'

export interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post('/Auth/login', payload)
  return loginResponseSchema.parse(data)
}
