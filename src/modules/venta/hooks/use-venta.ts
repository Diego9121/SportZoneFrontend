import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createVenta, getVentaById, getVentas } from '../api/venta.api'

//**********************************************CREATE */
export function useCreateVenta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      // el backend descuenta el stock de las variantes vendidas
      queryClient.invalidateQueries({ queryKey: ['variantes'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useVentas(page: number, pageSize: number, filter?: string) {
  return useQuery({
    queryKey: ['ventas', page, pageSize, filter],
    queryFn: () => getVentas({ page, pageSize, filter }),
    placeholderData: keepPreviousData,
  })
}
//**********************************************OBTENER POR ID (para el ticket PDF)*/
export function useVentaById(id: number | undefined) {
  return useQuery({
    queryKey: ['venta', id],
    queryFn: () => getVentaById(id as number),
    enabled: id !== undefined,
  })
}
