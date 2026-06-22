import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProveedor,
  deleteProveedor,
  getProveedores,
  updateProveedor,
  type ProveedorPayload,
} from '../api/proveedor.api'

//**********************************************CREATE */
export function useCreateProveedor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}
//**********************************************UPDATE */
export function useUpdateProveedor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProveedorPayload }) =>
      updateProveedor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}
//**********************************************DELETE */
export function useDeleteProveedor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useProveedores(page: number, pageSize: number, filter?: string) {
  return useQuery({
    queryKey: ['proveedores', page, pageSize, filter],
    queryFn: () => getProveedores({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}
