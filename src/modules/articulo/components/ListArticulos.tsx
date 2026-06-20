import { useState } from 'react'
import { ImageOff, Pencil, Plus, QrCode, Search, Trash } from 'lucide-react'
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
import { useArticulos } from '@/modules/articulo/hooks/use-articulo'
import type { Articulo } from '../schemas/articulo.schema'
import { useDeleteArticulo } from '../hooks/use-articulo'
import FormArticulo from './FormArticulo'

export function ListArticulos() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, error } = useArticulos(page, pageSize, filter)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingArticulo, setDeletingArticulo] = useState<Articulo | null>(null)
  const deleteArticuloId = useDeleteArticulo()
  const [editingArticulo, setEditingArticulo] = useState<Articulo | undefined>(
    undefined,
  )

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando artículos...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const articulos = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  function openDelete(articulo: Articulo) {
    setDeletingArticulo(articulo)
  }
  function confirmDelete() {
    if (!deletingArticulo) return
    deleteArticuloId.mutate(deletingArticulo.id, {
      onSuccess: () => {
        toast.success('Artículo eliminado correctamente.')
        setDeletingArticulo(null)
      },
      onError: () => {
        toast.error('No se pudo eliminar el artículo.')
      },
    })
  }
  function openCreate() {
    setEditingArticulo(undefined)
    setFormOpen(true)
  }

  function openEdit(articulo: Articulo) {
    setEditingArticulo(articulo)
    setFormOpen(true)
  }
  function openQr(id: number) {
    console.log('Generar QR para artículo ID:', id)
    const url = `http://localhost:5176/api/Articulos/${id}`
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`, '_blank')

  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar artículos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={openCreate}>
          <Plus />
          Nuevo artículo
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Variantes</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articulos.map((articulo) => (
            <TableRow key={articulo.id}>
              <TableCell>
                {articulo.imagen ? (
                  <img
                    src={articulo.imagen}
                    alt={articulo.nombre}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted flex items-center justify-center">
                    <ImageOff className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell>{articulo.codigo}</TableCell>
              <TableCell>{articulo.nombre}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                  {articulo.categoriaNombre}
                </span>
              </TableCell>
              <TableCell>{articulo.marcaNombre}</TableCell>
              <TableCell>{articulo.totalVariantes}</TableCell>
              <TableCell>{articulo.stockTotal}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar artículo"
                  onClick={() => openDelete(articulo)}
                >
                  <Trash />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Editar artículo"
                  onClick={() => openEdit(articulo)}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Generar QR"
                  onClick={() => openQr(articulo.id)}
                >
                  <QrCode />
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
        open={deletingArticulo !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingArticulo(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el artículo "{deletingArticulo?.nombre}" y
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteArticuloId.isPending}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingArticulo ? 'Editar artículo' : 'Nuevo artículo'}
            </DialogTitle>
          </DialogHeader>
          <FormArticulo
            articulo={editingArticulo}
            onSuccess={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
