import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { DashboardTopProducto } from '../schemas/dashboard.schema'

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const chartConfig = {
  totalVendido: { label: 'Total vendido' },
} satisfies ChartConfig

function acortar(nombre: string) {
  return nombre.length > 18 ? `${nombre.slice(0, 18)}…` : nombre
}

interface DashboardTopProductosProps {
  data: DashboardTopProducto[]
}

function DashboardTopProductos({ data }: DashboardTopProductosProps) {
  const productos = useMemo(
    () =>
      data.map((producto, index) => ({
        ...producto,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      })),
    [data],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top productos del mes</CardTitle>
        <CardDescription>Modelos más vendidos por monto.</CardDescription>
      </CardHeader>
      <CardContent>
        {productos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay ventas registradas este mes.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart accessibilityLayer data={productos} layout="vertical" margin={{ left: 0 }}>
              <YAxis
                dataKey="articuloNombre"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={110}
                tickFormatter={acortar}
              />
              <XAxis dataKey="totalVendido" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="totalVendido" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Top {productos.length} productos más vendidos del mes.
      </CardFooter>
    </Card>
  )
}

export default DashboardTopProductos
