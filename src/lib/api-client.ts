import axios from 'axios'
import { getStoredSession } from '@/lib/auth-storage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredSession()?.token
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})
