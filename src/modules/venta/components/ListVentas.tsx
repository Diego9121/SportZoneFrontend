import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, Eye, Plus, Search } from 'lucide-react'
import { formatMoneda } from '@/lib/currency'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useVentaById, useVentas } from '@/modules/venta/hooks/use-venta'
import VentaTicketPdf from './VentaTicketPdf'

function badgeVariantPorEstado(estado: string) {
  if (estado === 'PAGADA') return 'default' as const
  if (estado === 'ANULADA') return 'destructive' as const
  return 'secondary' as const
}

export function ListVentas() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, error } = useVentas(page, pageSize, filter)
  const [viewingVentaId, setViewingVentaId] = useState<number | undefined>(undefined)
  const { data: viewingVentaData } = useVentaById(viewingVentaId)
  const viewingVenta = viewingVentaData?.data

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando ventas...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const ventas = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  return (
    <div>
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar ventas..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button asChild>
          <Link to="/ventas/crear">
            <Plus />
            Nueva venta
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>N° de documento</TableHead>
            <TableHead>Comprobante</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                  {venta.clienteNombre ?? 'Cliente general'}
                </span>
              </TableCell>
              <TableCell>{venta.numeroDoc ?? '-'}</TableCell>
              <TableCell className="capitalize">{venta.tipoComprobante}</TableCell>
              <TableCell>{formatMoneda(venta.total)}</TableCell>
              <TableCell>
                <Badge variant={badgeVariantPorEstado(venta.estado)}>{venta.estado}</Badge>
              </TableCell>
              <TableCell>
                {new Date(venta.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Ver ticket"
                  onClick={() => setViewingVentaId(venta.id)}
                >
                  <Eye />
                </Button>
                <PDFDownloadLink
                  document={<VentaTicketPdf venta={venta} />}
                  fileName={`ticket-${venta.numeroDoc ?? venta.id}.pdf`}
                  className={buttonVariants({ size: 'icon', variant: 'ghost' })}
                  aria-label="Descargar ticket PDF"
                >
                  <Download />
                </PDFDownloadLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent className="flex justify-between w-[500px]">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Seleccione tamaño de página" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tamaño de página</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setPage((current) => Math.max(1, current - 1))
              }}
              className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setPage((current) => Math.min(totalPages, current + 1))
              }}
              className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Dialog
        open={viewingVentaId !== undefined}
        onOpenChange={(open) => {
          if (!open) setViewingVentaId(undefined)
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Venta de {viewingVenta?.clienteNombre ?? 'Cliente general'}</DialogTitle>
          </DialogHeader>
          {viewingVenta ? (
            <div className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-muted-foreground">N° de documento</div>
                  <div>{viewingVenta.numeroDoc ?? '-'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fecha</div>
                  <div>{new Date(viewingVenta.createdAt).toLocaleString()}</div>
                </div>
                {viewingVenta.observacion && (
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Observación</div>
                    <div>{viewingVenta.observacion}</div>
                  </div>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variante</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewingVenta.detalles.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.varianteDescripcion}</TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{formatMoneda(detalle.precioUnitario)}</TableCell>
                      <TableCell>{formatMoneda(detalle.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end text-base font-medium">
                Total: {formatMoneda(viewingVenta.total)}
              </div>
              <PDFDownloadLink
                document={<VentaTicketPdf venta={viewingVenta} />}
                fileName={`ticket-${viewingVenta.numeroDoc ?? viewingVenta.id}.pdf`}
                className={buttonVariants({ variant: 'outline' })}
              >
                {({ loading }) => (loading ? 'Generando ticket...' : 'Descargar ticket')}
              </PDFDownloadLink>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
