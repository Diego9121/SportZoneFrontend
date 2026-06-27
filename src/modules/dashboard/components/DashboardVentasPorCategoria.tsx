import { useMemo } from 'react'
import { Pie, PieChart, Sector } from 'recharts'
import type { PieSectorShapeProps } from 'recharts/types/polar/Pie'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { DashboardVentasPorCategoria } from '../schemas/dashboard.schema'

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

interface DashboardVentasPorCategoriaProps {
  data: DashboardVentasPorCategoria[]
}

function DashboardVentasPorCategoriaChart({ data }: DashboardVentasPorCategoriaProps) {
  const categorias = useMemo(
    () =>
      [...data]
        .sort((a, b) => b.total - a.total)
        .map((categoria, index) => ({
          ...categoria,
          key: `categoria-${categoria.categoriaId}`,
          // Recharts solo toma el color de cada porción de un campo llamado "fill" en el dato;
          // cualquier otro nombre (ej. "color") se ignora y cae al gris por defecto de <Pie>.
          fill: CHART_COLORS[index % CHART_COLORS.length],
        })),
    [data],
  )

  const chartConfig = useMemo(() => {
    const config: ChartConfig = { total: { label: 'Ventas' } }
    categorias.forEach((categoria) => {
      config[categoria.key] = { label: categoria.categoriaNombre, color: categoria.fill }
    })
    return config
  }, [categorias])

  const principal = categorias[0]

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Ventas por categoría</CardTitle>
        <CardDescription>Distribución de ventas del mes actual.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
        {categorias.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay ventas registradas este mes.</p>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[220px] w-full max-w-[220px] shrink-0"
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="key" />} />
                <Pie
                  data={categorias}
                  dataKey="total"
                  nameKey="key"
                  innerRadius={55}
                  strokeWidth={5}
                  shape={({ index, outerRadius = 0, ...props }: PieSectorShapeProps) =>
                    index === 0 ? (
                      <Sector {...props} outerRadius={outerRadius + 8} />
                    ) : (
                      <Sector {...props} outerRadius={outerRadius} />
                    )
                  }
                />
              </PieChart>
            </ChartContainer>
            <ul className="flex w-full flex-1 flex-col gap-2 text-sm">
              {categorias.map((categoria) => (
                <li key={categoria.categoriaId} className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: categoria.fill }}
                    />
                    <span className="truncate">{categoria.categoriaNombre}</span>
                  </span>
                  <span className="shrink-0 font-medium text-foreground">
                    {categoria.porcentaje.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
      {principal && (
        <CardFooter className="text-sm text-muted-foreground">
          {principal.categoriaNombre} representa el {principal.porcentaje.toFixed(1)}% de las ventas del mes.
        </CardFooter>
      )}
    </Card>
  )
}

export default DashboardVentasPorCategoriaChart
