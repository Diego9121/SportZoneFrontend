import { useQuery } from '@tanstack/react-query'
import { getMarcas } from '@/modules/marca/api/marca.api'

export function useMarcas() {
  return useQuery({
    queryKey: ['marcas'],
    queryFn: getMarcas,
  })
}
