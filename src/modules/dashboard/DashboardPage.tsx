import { useMemo, useState } from 'react'
import { DollarSign, Footprints, Percent, ShoppingCart } from 'lucide-react'
import { formatMoneda } from '@/lib/currency'
import { PageHeader } from '@/components/layout/page-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const MESES = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]

function getAnios() {
  const actual = new Date().getFullYear()
  return [actual - 1, actual]
}

function DashboardPage() {
  const hoy = new Date()
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [mes, setMes] = useState(hoy.getMonth() + 1)

  const ventasMes = useDashboardVentasMes(anio, mes)
  const comprasMes = useDashboardComprasMes(anio, mes)
  const margenMes = useDashboardMargenGananciaMes(anio, mes)
  const paresMes = useDashboardParesVendidosMes(anio, mes)
  const comprasVsVentas = useDashboardComprasVsVentasMes(anio, mes)
  const ventasPorCategoria = useDashboardVentasPorCategoriaMes(anio, mes)
  const topProductos = useDashboardTopProductosMes(anio, mes, 5)

  const serieDiaria = useMemo(
    () =>
      (comprasVsVentas.data?.data ?? []).map((item) => ({
        date: item.fecha,
        ventas: item.totalVentas,
        compras: item.totalCompras,
      })),
    [comprasVsVentas.data],
  )

  const anios = getAnios()

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Dashboard"
          description="Resumen general de ventas, inventario y actividad de la tienda."
        />
        <div className="flex items-center gap-2">
          <Select value={mes.toString()} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={anio.toString()} onValueChange={(v) => setAnio(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anios.map((a) => (
                <SelectItem key={a} value={a.toString()}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardKpiCard
          title="Ventas del mes"
          value={formatMoneda(ventasMes.data?.data.totalMesActual ?? 0)}
          trend={ventasMes.data?.data.porcentajeCambio}
          icon={DollarSign}
        />
        <DashboardKpiCard
          title="Compras del mes"
          value={formatMoneda(comprasMes.data?.data.totalMesActual ?? 0)}
          trend={comprasMes.data?.data.porcentajeCambio}
          icon={ShoppingCart}
        />
        <DashboardKpiCard
          title="Margen de ganancia"
          value={formatMoneda(margenMes.data?.data.gananciaBruta ?? 0)}
          description={`Margen: ${(margenMes.data?.data.margenPorcentaje ?? 0).toFixed(1)}%`}
          icon={Percent}
        />
        <DashboardKpiCard
          title="Pares vendidos"
          value={`${paresMes.data?.data.paresVendidos ?? 0}`}
          description="Unidades vendidas en el periodo"
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
