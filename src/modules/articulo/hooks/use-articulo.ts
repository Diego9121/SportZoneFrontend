import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createArticulo,
  deleteArticulo,
  getArticulos,
  updateArticulo,
  type ArticuloPayload,
} from '../api/articulo.api'

//**********************************************CREATE */
export function useCreateArticulo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createArticulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] })
    },
  })
}
//**********************************************UPDATE */
export function useUpdateArticulo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ArticuloPayload }) =>
      updateArticulo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] })
    },
  })
}
//**********************************************DELETE */
export function useDeleteArticulo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArticulo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articulos'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useArticulos(page: number, pageSize: number, filter?: string) {
  return useQuery({
    queryKey: ['articulos', page, pageSize, filter],
    queryFn: () => getArticulos({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}
