import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getReporteCompras, getReporteVentas } from '../api/reporte.api'
import type { GetReporteParams } from '../api/reporte.api'

export function useReporteVentas(params: GetReporteParams) {
  return useQuery({
    queryKey: ['reportes', 'ventas', params],
    queryFn: () => getReporteVentas(params),
    placeholderData: keepPreviousData,
  })
}

export function useReporteCompras(params: GetReporteParams) {
  return useQuery({
    queryKey: ['reportes', 'compras', params],
    queryFn: () => getReporteCompras(params),
    placeholderData: keepPreviousData,
  })
}
