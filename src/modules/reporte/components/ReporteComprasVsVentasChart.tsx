import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { SerieDiaria } from '@/modules/reporte/lib/agrupar-por-dia'

const chartConfig = {
  ventas: { label: 'Ventas', color: 'var(--chart-1)' },
  compras: { label: 'Compras', color: 'var(--chart-2)' },
} satisfies ChartConfig

function formatearFecha(value: unknown) {
  return new Date(String(value)).toLocaleDateString('es-BO', { month: 'short', day: 'numeric' })
}

interface ReporteComprasVsVentasChartProps {
  data: SerieDiaria[]
}

function ReporteComprasVsVentasChart({ data }: ReporteComprasVsVentasChartProps) {
  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <CardTitle>Compras vs Ventas</CardTitle>
        <CardDescription>Comparativo diario del periodo filtrado.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay datos para el periodo seleccionado.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-ventas)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-ventas)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillCompras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-compras)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-compras)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatearFecha}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={formatearFecha} indicator="dot" />}
              />
              {/* Sin stackId: son dos magnitudes independientes, se superponen para comparar, no se suman */}
              <Area dataKey="compras" type="natural" fill="url(#fillCompras)" stroke="var(--color-compras)" />
              <Area dataKey="ventas" type="natural" fill="url(#fillVentas)" stroke="var(--color-ventas)" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default ReporteComprasVsVentasChart
