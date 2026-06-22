import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Eye, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useIngresos } from '@/modules/ingreso/hooks/use-ingreso'
import type { Ingreso } from '../schemas/ingreso.schema'

export function ListIngresos() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, error } = useIngresos(page, pageSize, filter)
  const [viewingIngreso, setViewingIngreso] = useState<Ingreso | null>(null)

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando ingresos...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const ingresos = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  return (
    <div>
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar ingresos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button asChild>
          <Link to="/compras/crear">
            <Plus />
            Nuevo ingreso
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>N° de documento</TableHead>
            <TableHead>Líneas</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingresos.map((ingreso) => (
            <TableRow key={ingreso.id}>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                  {ingreso.proveedorNombre}
                </span>
              </TableCell>
              <TableCell>{ingreso.numeroDoc ?? '-'}</TableCell>
              <TableCell>{ingreso.detalles.length}</TableCell>
              <TableCell>Bs. {ingreso.total.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(ingreso.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Ver detalle"
                  onClick={() => setViewingIngreso(ingreso)}
                >
                  <Eye />
                </Button>
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
        open={viewingIngreso !== null}
        onOpenChange={(open) => {
          if (!open) setViewingIngreso(null)
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ingreso de {viewingIngreso?.proveedorNombre}</DialogTitle>
          </DialogHeader>
          {viewingIngreso && (
            <div className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-muted-foreground">N° de documento</div>
                  <div>{viewingIngreso.numeroDoc ?? '-'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fecha</div>
                  <div>{new Date(viewingIngreso.createdAt).toLocaleString()}</div>
                </div>
                {viewingIngreso.observacion && (
                  <div className="col-span-2">
                    <div className="text-muted-foreground">Observación</div>
                    <div>{viewingIngreso.observacion}</div>
                  </div>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variante</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio costo</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewingIngreso.detalles.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.varianteDescripcion}</TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>Bs. {detalle.precioCosto.toFixed(2)}</TableCell>
                      <TableCell>Bs. {detalle.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end text-base font-medium">
                Total: Bs. {viewingIngreso.total.toFixed(2)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
