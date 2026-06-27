import { useQuery } from '@tanstack/react-query'
import { getRoles } from '../api/rol.api'

//**********************************************OBTENER (GET)*/
export function useRoles(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['roles', page, pageSize],
    queryFn: () => getRoles({ page, pageSize }),
  })
}
