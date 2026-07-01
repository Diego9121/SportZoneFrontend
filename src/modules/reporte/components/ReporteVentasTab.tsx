import { Fragment, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ChevronDown, ChevronRight, Download } from 'lucide-react'
import { formatMoneda } from '@/lib/currency'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useReporteVentas } from '@/modules/reporte/hooks/use-reporte'
import { toDesdeParam, toHastaParam } from '@/modules/reporte/lib/rango-fecha'
import ReporteFiltros from './ReporteFiltros'
import ReporteVentasPdf from './ReporteVentasPdf'

function badgeVariantPorEstado(estado: string) {
  if (estado === 'PAGADA') return 'default' as const
  if (estado === 'ANULADA') return 'destructive' as const
  return 'secondary' as const
}

function ReporteVentasTab() {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  function toggleExpanded(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const desdeParam = toDesdeParam(desde)
  const hastaParam = toHastaParam(hasta)
  const { data, isLoading, isError, error } = useReporteVentas({
    desde: desdeParam,
    hasta: hastaParam,
  })

  const resumen = data?.data.resumen
  const ventas = data?.data.ventas ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <ReporteFiltros
          desde={desde}
          hasta={hasta}
          onDesdeChange={setDesde}
          onHastaChange={setHasta}
        />
        {resumen && (
          <PDFDownloadLink
            document={
              <ReporteVentasPdf
                resumen={resumen}
                ventas={ventas}
                desde={desdeParam}
                hasta={hastaParam}
              />
            }
            fileName="reporte-ventas.pdf"
            className={buttonVariants({ variant: 'outline' })}
          >
            {({ loading }) => (
              <>
                <Download />
                {loading ? 'Generando PDF...' : 'Exportar a PDF'}
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando reporte...</p>}
      {isError && <p className="text-sm text-destructive">{error.message}</p>}

      {resumen && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Cantidad de ventas</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{resumen.cantidadVentas}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Total vendido</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{formatMoneda(resumen.totalVendido)}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Descuentos</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{formatMoneda(resumen.totalDescuentos)}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Ticket promedio</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{formatMoneda(resumen.ticketPromedio)}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Costo total</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{formatMoneda(resumen.totalCosto)}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Ganancia bruta</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{formatMoneda(resumen.gananciaBruta)}</CardContent>
          </Card>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>N° de documento</TableHead>
            <TableHead>Comprobante</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Ganancia</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.map((venta) => {
            const expanded = expandedIds.has(venta.id)
            return (
              <Fragment key={venta.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={expanded ? 'Ocultar items' : 'Ver items'}
                      onClick={() => toggleExpanded(venta.id)}
                    >
                      {expanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </TableCell>
                  <TableCell>{venta.numeroDoc ?? `#${venta.id}`}</TableCell>
                  <TableCell className="capitalize">{venta.tipoComprobante}</TableCell>
                  <TableCell>{venta.clienteNombre ?? 'Cliente general'}</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariantPorEstado(venta.estado)}>{venta.estado}</Badge>
                  </TableCell>
                  <TableCell>{formatMoneda(venta.total)}</TableCell>
                  <TableCell>{formatMoneda(venta.descuento)}</TableCell>
                  <TableCell>{formatMoneda(venta.costo)}</TableCell>
                  <TableCell>{formatMoneda(venta.ganancia)}</TableCell>
                  <TableCell>{new Date(venta.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
                {expanded && (
                  <TableRow>
                    <TableCell colSpan={10} className="bg-muted/30 p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio unitario</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {venta.detalles.map((detalle, index) => (
                            <TableRow key={index}>
                              <TableCell>{detalle.nombre}</TableCell>
                              <TableCell>{detalle.cantidad}</TableCell>
                              <TableCell>{formatMoneda(detalle.precioUnitario)}</TableCell>
                              <TableCell>{formatMoneda(detalle.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default ReporteVentasTab
