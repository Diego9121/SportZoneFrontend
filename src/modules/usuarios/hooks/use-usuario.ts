import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUsuario, deleteUsuarios, getUsuarios, updateUsuario, type UsuarioUpdatePayload } from '../api/usuario.api'


//**********************************************CREATE */
export function useCreateUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
//**********************************************UPDATE */
export function useUpdateUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UsuarioUpdatePayload }) =>
      updateUsuario(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
//**********************************************DELETE */
export function useDeleteUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUsuarios,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function UseObtenerUsuarios(page: number, pageSize : number, filter?: string) {
  return useQuery({
    queryKey: ['usuarios', page, pageSize, filter],
    queryFn: () => getUsuarios({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}