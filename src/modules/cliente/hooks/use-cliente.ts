import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
  type ClientePayload,
} from '../api/cliente.api'

//**********************************************CREATE */
export function useCreateCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}
//**********************************************UPDATE */
export function useUpdateCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClientePayload }) =>
      updateCliente(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}
//**********************************************DELETE */
export function useDeleteCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useClientes(page: number, pageSize: number, filter?: string) {
  return useQuery({
    queryKey: ['clientes', page, pageSize, filter],
    queryFn: () => getClientes({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}
