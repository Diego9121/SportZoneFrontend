import { useMutation } from '@tanstack/react-query'
import { login } from '@/modules/auth/api/auth.api'

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
