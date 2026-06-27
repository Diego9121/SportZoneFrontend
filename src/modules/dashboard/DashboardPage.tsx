import { useMemo } from 'react'
import { DollarSign, Footprints, Percent, ShoppingCart } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import ReporteComprasVsVentasChart from '@/modules/reporte/components/ReporteComprasVsVentasChart'
import DashboardKpiCard from './components/DashboardKpiCard'
import DashboardTopProductos from './components/DashboardTopProductos'
import DashboardVentasPorCategoria from './components/DashboardVentasPorCategoria'
import {
  useDashboardComprasMes,
  useDashboardComprasVsVentasMes,
  useDashboardMargenGananciaMes,
  useDashboardParesVendidosMes,
  useDashboardTopProductosMes,
  useDashboardVentasMes,
  useDashboardVentasPorCategoriaMes,
} from './hooks/use-dashboard'

function DashboardPage() {
  const ventasMes = useDashboardVentasMes()
  const comprasMes = useDashboardComprasMes()
  const margenMes = useDashboardMargenGananciaMes()
  const paresMes = useDashboardParesVendidosMes()
  const comprasVsVentas = useDashboardComprasVsVentasMes()
  const ventasPorCategoria = useDashboardVentasPorCategoriaMes()
  const topProductos = useDashboardTopProductosMes(5)

  const serieDiaria = useMemo(
    () =>
      (comprasVsVentas.data?.data ?? []).map((item) => ({
        date: item.fecha,
        ventas: item.totalVentas,
        compras: item.totalCompras,
      })),
    [comprasVsVentas.data],
  )

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Dashboard"
        description="Resumen general de ventas, inventario y actividad de la tienda."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardKpiCard
          title="Ventas del mes"
          value={`Bs. ${(ventasMes.data?.data.totalMesActual ?? 0).toFixed(2)}`}
          trend={ventasMes.data?.data.porcentajeCambio}
          icon={DollarSign}
        />
        <DashboardKpiCard
          title="Compras del mes"
          value={`Bs. ${(comprasMes.data?.data.totalMesActual ?? 0).toFixed(2)}`}
          trend={comprasMes.data?.data.porcentajeCambio}
          icon={ShoppingCart}
        />
        <DashboardKpiCard
          title="Margen de ganancia"
          value={`Bs. ${(margenMes.data?.data.gananciaBruta ?? 0).toFixed(2)}`}
          description={`Margen: ${(margenMes.data?.data.margenPorcentaje ?? 0).toFixed(1)}%`}
          icon={Percent}
        />
        <DashboardKpiCard
          title="Pares vendidos"
          value={`${paresMes.data?.data.paresVendidos ?? 0}`}
          description="Unidades vendidas este mes"
          icon={Footprints}
        />
      </div>

      <ReporteComprasVsVentasChart data={serieDiaria} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardVentasPorCategoria data={ventasPorCategoria.data?.data ?? []} />
        <DashboardTopProductos data={topProductos.data?.data ?? []} />
      </div>
    </div>
  )
}

export default DashboardPage
