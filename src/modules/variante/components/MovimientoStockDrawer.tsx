import { useMemo } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMovimientosStock } from '@/modules/variante/hooks/use-variante'

const COLOR_ENTRADA = '#16a34a'
const COLOR_SALIDA = '#dc2626'

interface MovimientoStockDrawerProps {
  varianteId: number | undefined
  varianteDescripcion?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function MovimientoStockDrawer({
  varianteId,
  varianteDescripcion,
  open,
  onOpenChange,
}: MovimientoStockDrawerProps) {
  const { data, isLoading } = useMovimientosStock(open ? varianteId : undefined)
  const movimientos = useMemo(() => data?.data ?? [], [data])

  // El endpoint devuelve del más reciente al más antiguo; para el gráfico se
  // muestra de izquierda (antiguo) a derecha (reciente), como una línea de tiempo.
  const datosGrafico = useMemo(
    () =>
      [...movimientos].reverse().map((movimiento) => ({
        fecha: new Date(movimiento.createdAt).toLocaleDateString(),
        cantidad:
          movimiento.tipoMovimiento === 'ENTRADA' ? movimiento.cantidad : -movimiento.cantidad,
        tipoMovimiento: movimiento.tipoMovimiento,
      })),
    [movimientos],
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>{varianteDescripcion ?? 'Movimiento de stock'}</DrawerTitle>
            <DrawerDescription>
              Historial de entradas (compras) y salidas (ventas) de esta variante.
            </DrawerDescription>
          </DrawerHeader>

          <div className="max-h-[55vh] overflow-y-auto p-4 pt-0">
            {isLoading && (
              <p className="text-sm text-muted-foreground">Cargando movimientos...</p>
            )}

            {!isLoading && movimientos.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Esta variante todavía no tiene movimientos de stock.
              </p>
            )}

            {datosGrafico.length > 0 && (
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGrafico}>
                    <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="cantidad" name="Cantidad" radius={2}>
                      {datosGrafico.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.tipoMovimiento === 'ENTRADA' ? COLOR_ENTRADA : COLOR_SALIDA}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {movimientos.length > 0 && (
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Referencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos.map((movimiento) => (
                    <TableRow key={movimiento.id}>
                      <TableCell>
                        {new Date(movimiento.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movimiento.tipoMovimiento === 'ENTRADA' ? 'outline' : 'destructive'
                          }
                        >
                          {movimiento.tipoMovimiento}
                        </Badge>
                      </TableCell>
                      <TableCell>{movimiento.cantidad}</TableCell>
                      <TableCell>{movimiento.numeroDoc ?? '-'}</TableCell>
                      <TableCell>
                        {movimiento.ingresoId
                          ? `Ingreso #${movimiento.ingresoId}`
                          : movimiento.ventaId
                            ? `Venta #${movimiento.ventaId}`
                            : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MovimientoStockDrawer
