import { Fragment, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ChevronDown, ChevronRight, Download } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useReporteCompras } from '@/modules/reporte/hooks/use-reporte'
import { toDesdeParam, toHastaParam } from '@/modules/reporte/lib/rango-fecha'
import ReporteFiltros from './ReporteFiltros'
import ReporteComprasPdf from './ReporteComprasPdf'

function ReporteComprasTab() {
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
  const { data, isLoading, isError, error } = useReporteCompras({
    desde: desdeParam,
    hasta: hastaParam,
  })

  const resumen = data?.data.resumen
  const compras = data?.data.compras ?? []

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
              <ReporteComprasPdf
                resumen={resumen}
                compras={compras}
                desde={desdeParam}
                hasta={hastaParam}
              />
            }
            fileName="reporte-compras.pdf"
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Cantidad de compras</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">{resumen.cantidadIngresos}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Total comprado</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">Bs. {resumen.totalComprado.toFixed(2)}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Compra promedio</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">Bs. {resumen.compraPromedio.toFixed(2)}</CardContent>
          </Card>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>N° de documento</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compras.map((compra) => {
            const expanded = expandedIds.has(compra.id)
            return (
              <Fragment key={compra.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={expanded ? 'Ocultar items' : 'Ver items'}
                      onClick={() => toggleExpanded(compra.id)}
                    >
                      {expanded ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </TableCell>
                  <TableCell>{compra.numeroDoc ?? `#${compra.id}`}</TableCell>
                  <TableCell>{compra.proveedorNombre ?? '-'}</TableCell>
                  <TableCell>Bs. {compra.total.toFixed(2)}</TableCell>
                  <TableCell>{new Date(compra.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
                {expanded && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/30 p-0">
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
                          {compra.detalles.map((detalle, index) => (
                            <TableRow key={index}>
                              <TableCell>{detalle.nombre}</TableCell>
                              <TableCell>{detalle.cantidad}</TableCell>
                              <TableCell>Bs. {detalle.precioUnitario.toFixed(2)}</TableCell>
                              <TableCell>Bs. {detalle.total.toFixed(2)}</TableCell>
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

export default ReporteComprasTab
