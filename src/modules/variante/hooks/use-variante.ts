import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createVariante,
  deleteVariante,
  getCatalogoVariantes,
  getMovimientosStock,
  getVarianteByCodigoBarras,
  getVariantes,
  updateVariante,
  type VarianteUpdatePayload,
} from '../api/variante.api'

//**********************************************CREATE */
export function useCreateVariante() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVariante,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variantes'] })
    },
  })
}
//**********************************************UPDATE */
export function useUpdateVariante() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: VarianteUpdatePayload }) =>
      updateVariante(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variantes'] })
    },
  })
}
//**********************************************DELETE */
export function useDeleteVariante() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteVariante,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variantes'] })
    },
  })
}
//**********************************************OBTENER (GET)*/
export function useVariantes(
  page: number,
  pageSize: number,
  filter?: string,
  articuloId?: number,
) {
  return useQuery({
    queryKey: ['variantes', page, pageSize, filter, articuloId],
    queryFn: () =>
      getVariantes({
        page,
        pageSize,
        filter,
        articuloId,
        sortBy: 'id',
        sortDirection: 'desc',
      }),
    placeholderData: keepPreviousData,
  })
}
//**********************************************OBTENER TODAS (para combobox/buscador)*/
export function useAllVariantes() {
  return useQuery({
    queryKey: ['variantes', 'all'],
    queryFn: () => getVariantes({ isPage: false }),
  })
}
//**********************************************BUSCAR POR CÓDIGO DE BARRAS*/
export function useVarianteByCodigoBarras() {
  return useMutation({
    mutationFn: getVarianteByCodigoBarras,
  })
}
//**********************************************CATÁLOGO (POS)*/
// Trae todo el catálogo con stock disponible de una vez; el filtro de texto
// se aplica en el cliente (igual criterio que la página de Búsqueda de Artículos).
export function useCatalogoVariantes() {
  return useQuery({
    queryKey: ['variantes', 'catalogo'],
    queryFn: () => getCatalogoVariantes({ isPage: false, stock: 1 }),
  })
}
//**********************************************MOVIMIENTOS DE STOCK*/
export function useMovimientosStock(varianteId: number | undefined) {
  return useQuery({
    queryKey: ['movimientos-stock', varianteId],
    queryFn: () => getMovimientosStock(varianteId as number),
    enabled: varianteId !== undefined,
  })
}
