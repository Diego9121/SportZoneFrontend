import { useQuery } from '@tanstack/react-query'
import {
  getDashboardComprasMes,
  getDashboardComprasVsVentasMes,
  getDashboardMargenGananciaMes,
  getDashboardParesVendidosMes,
  getDashboardTopProductosMes,
  getDashboardVentasMes,
  getDashboardVentasPorCategoriaMes,
} from '../api/dashboard.api'

export function useDashboardVentasMes(anio: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'ventas-mes', anio, mes],
    queryFn: () => getDashboardVentasMes(anio, mes),
  })
}

export function useDashboardComprasMes(anio: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'compras-mes', anio, mes],
    queryFn: () => getDashboardComprasMes(anio, mes),
  })
}

export function useDashboardMargenGananciaMes(anio: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'margen-ganancia-mes', anio, mes],
    queryFn: () => getDashboardMargenGananciaMes(anio, mes),
  })
}

export function useDashboardParesVendidosMes(anio: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'pares-vendidos-mes', anio, mes],
    queryFn: () => getDashboardParesVendidosMes(anio, mes),
  })
}

export function useDashboardVentasPorCategoriaMes(anio: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'ventas-por-categoria-mes', anio, mes],
    queryFn: () => getDashboardVentasPorCategoriaMes(anio, mes),
  })
}

export function useDashboardTopProductosMes(anio: number, mes: number, top = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-productos-mes', anio, mes, top],
    queryFn: () => getDashboardTopProductosMes(anio, mes, top),
  })
}

export function useDashboardComprasVsVentasMes(anio: number, mes: number) {
  return useQuery({
    queryKey: ['dashboard', 'compras-vs-ventas-mes', anio, mes],
    queryFn: () => getDashboardComprasVsVentasMes(anio, mes),
  })
}
