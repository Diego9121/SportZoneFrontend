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

export function useDashboardVentasMes() {
  return useQuery({
    queryKey: ['dashboard', 'ventas-mes'],
    queryFn: getDashboardVentasMes,
  })
}

export function useDashboardComprasMes() {
  return useQuery({
    queryKey: ['dashboard', 'compras-mes'],
    queryFn: getDashboardComprasMes,
  })
}

export function useDashboardMargenGananciaMes() {
  return useQuery({
    queryKey: ['dashboard', 'margen-ganancia-mes'],
    queryFn: getDashboardMargenGananciaMes,
  })
}

export function useDashboardParesVendidosMes() {
  return useQuery({
    queryKey: ['dashboard', 'pares-vendidos-mes'],
    queryFn: getDashboardParesVendidosMes,
  })
}

export function useDashboardVentasPorCategoriaMes() {
  return useQuery({
    queryKey: ['dashboard', 'ventas-por-categoria-mes'],
    queryFn: getDashboardVentasPorCategoriaMes,
  })
}

export function useDashboardTopProductosMes(top = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-productos-mes', top],
    queryFn: () => getDashboardTopProductosMes(top),
  })
}

export function useDashboardComprasVsVentasMes() {
  return useQuery({
    queryKey: ['dashboard', 'compras-vs-ventas-mes'],
    queryFn: getDashboardComprasVsVentasMes,
  })
}
