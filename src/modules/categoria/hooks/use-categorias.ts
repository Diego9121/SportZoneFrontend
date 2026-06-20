import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCategorias } from '@/modules/categoria/api/categoria.api'

export function useCategorias(page: number, pageSize : number, filter?: string) {
  return useQuery({
    queryKey: ['categorias', page, pageSize, filter],
    queryFn: () => getCategorias({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}
