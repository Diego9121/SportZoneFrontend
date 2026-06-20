import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMarca, deleteMarca, getMarcas, updateMarca, type MarcaPayload } from '../api/marca.api'

//**********************************************CREATE */
export function useCreateMarca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMarca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
    },
  })
}
//**********************************************UPDATE */
export function useUpdateMarca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MarcaPayload }) =>
      updateMarca(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
    },
  })
}
//**********************************************DELETE */
export function useDeleteMarca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMarca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useMarcas(page: number, pageSize : number, filter?: string) {
  return useQuery({
    queryKey: ['marcas', page, pageSize, filter],
    queryFn: () => getMarcas({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}