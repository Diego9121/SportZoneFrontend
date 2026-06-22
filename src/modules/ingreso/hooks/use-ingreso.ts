import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createIngreso, getIngresos } from '../api/ingreso.api'

//**********************************************CREATE */
export function useCreateIngreso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingresos'] })
      // el backend actualiza stock y precioCosto de las variantes del detalle
      queryClient.invalidateQueries({ queryKey: ['variantes'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useIngresos(page: number, pageSize: number, filter?: string) {
  return useQuery({
    queryKey: ['ingresos', page, pageSize, filter],
    queryFn: () => getIngresos({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}
