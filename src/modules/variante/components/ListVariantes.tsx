import { useMemo, useState } from 'react'
import { Activity, Pencil, Plus, Search, Trash } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
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
import { useArticulos } from '@/modules/articulo/hooks/use-articulo'
import { useDeleteVariante, useVariantes } from '@/modules/variante/hooks/use-variante'
import type { Variante } from '../schemas/variante.schema'
import FormVariante from './FormVariante'
import MovimientoStockDrawer from './MovimientoStockDrawer'

export function ListVariantes() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const [articuloId, setArticuloId] = useState<number | undefined>(undefined)
  const { data, isLoading, isError, error } = useVariantes(page, pageSize, filter, articuloId)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingVariante, setDeletingVariante] = useState<Variante | null>(null)
  const deleteVarianteId = useDeleteVariante()
  const [editingVariante, setEditingVariante] = useState<Variante | undefined>(undefined)
  const [movimientoVariante, setMovimientoVariante] = useState<Variante | null>(null)

  const { data: articulosData } = useArticulos(1, 100)
  const articulos = useMemo(() => articulosData?.data.items ?? [], [articulosData])
  const articuloItems = useMemo(
    () =>
      articulos.map((articulo) => ({
        value: articulo.id,
        label: `${articulo.nombre} (${articulo.codigo})`,
      })),
    [articulos],
  )
  const selectedArticuloItem =
    articuloItems.find((item) => item.value === articuloId) ?? null

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando variantes...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const variantes = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  function openDelete(variante: Variante) {
    setDeletingVariante(variante)
  }
  function confirmDelete() {
    if (!deletingVariante) return
    deleteVarianteId.mutate(deletingVariante.id, {
      onSuccess: () => {
        toast.success('Variante eliminada correctamente.')
        setDeletingVariante(null)
      },
      onError: () => {
        toast.error('No se pudo eliminar la variante.')
      },
    })
  }
  function openCreate() {
    setEditingVariante(undefined)
    setFormOpen(true)
  }

  function openEdit(variante: Variante) {
    setEditingVariante(variante)
    setFormOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <InputGroup className="w-[260px]">
            <InputGroupInput
              id="input-group-url"
              placeholder="Buscar variantes..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Combobox
            items={articuloItems}
            value={selectedArticuloItem}
            onValueChange={(item) => {
              setPage(1)
              setArticuloId(item ? item.value : undefined)
            }}
            isItemEqualToValue={(a, b) => a.value === b.value}
          >
            <ComboboxInput className="w-[220px]" placeholder="Todos los artículos" showClear />
            <ComboboxContent>
              <ComboboxEmpty>No se encontraron artículos.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          Agregar Talla/Color
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Artículo</TableHead>
            <TableHead>Talla</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Código de barras</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio venta</TableHead>
            <TableHead>Precio costo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variantes.map((variante) => (
            <TableRow key={variante.id}>
              <TableCell>
                <div className="font-medium">{variante.articuloNombre}</div>
                <div className="text-xs text-muted-foreground">{variante.articuloCodigo}</div>
              </TableCell>
              <TableCell className="text-xs">
                <div>US {variante.tallaUs ?? '-'} · EU {variante.tallaEu ?? '-'}</div>
                <div className="text-muted-foreground">
                  UK {variante.tallaUk ?? '-'} · {variante.tallaCm ?? '-'} cm
                </div>
              </TableCell>
              <TableCell>{variante.color ?? '-'}</TableCell>
              <TableCell>{variante.codigoBarras ?? '-'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{variante.stock}</span>
                  {variante.stock === 0 ? <Badge variant="destructive">Agotado</Badge> : variante.stock <= variante.stockMinimo ? <Badge variant="outline" className="bg-amber-400/30 text-amber-600">Stock bajo</Badge> : null}
                </div>
              </TableCell>
              <TableCell>{variante.precioVenta}</TableCell>
              <TableCell>{variante.precioCosto}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Ver movimiento de stock"
                  onClick={() => setMovimientoVariante(variante)}
                >
                  <Activity />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar variante"
                  onClick={() => openDelete(variante)}
                >
                  <Trash />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Editar variante"
                  onClick={() => openEdit(variante)}
                >
                  <Pencil />
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
      <AlertDialog
        open={deletingVariante !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingVariante(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la variante "{deletingVariante?.color} - US{' '}
              {deletingVariante?.tallaUs}" del artículo "{deletingVariante?.articuloNombre}" y no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteVarianteId.isPending}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingVariante ? 'Editar Talla/Color' : 'Agregar Talla/Color'}
            </DialogTitle>
          </DialogHeader>
          <FormVariante
            variante={editingVariante}
            onSuccess={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <MovimientoStockDrawer
        varianteId={movimientoVariante?.id}
        varianteDescripcion={
          movimientoVariante
            ? `${movimientoVariante.articuloNombre} - ${movimientoVariante.color ?? ''}`
            : undefined
        }
        open={movimientoVariante !== null}
        onOpenChange={(open) => {
          if (!open) setMovimientoVariante(null)
        }}
      />
    </div>
  )
}
