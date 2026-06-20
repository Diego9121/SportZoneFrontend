import { useState } from 'react'
import { Pencil, Plus, Search, Trash } from 'lucide-react'
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
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import FormCategoria from '@/modules/categoria/components/FormCategoria'
import { useCategorias } from '@/modules/categoria/hooks/use-categorias'
import { useDeleteCategoria } from '@/modules/categoria/hooks/use-delete-categoria'
import type { Categoria } from '@/modules/categoria/schemas/categoria.schema'

export function ListCategorias() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>(
    undefined,
  )
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(
    null,
  )
  const { data, isLoading, isError, error } = useCategorias(page, pageSize, filter)
  const deleteCategoria = useDeleteCategoria()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando categorías...</p>
  }
  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const categorias = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  function openCreate() {
    setEditingCategoria(undefined)
    setFormOpen(true)
  }

  function openEdit(categoria: Categoria) {
    setEditingCategoria(categoria)
    setFormOpen(true)
  }

  function openDelete(categoria: Categoria) {
    setDeletingCategoria(categoria)
  }

  function confirmDelete() {
    if (!deletingCategoria) return
    deleteCategoria.mutate(deletingCategoria.id, {
      onSuccess: () => {
        toast.success('Categoría eliminada correctamente.')
        setDeletingCategoria(null)
      },
      onError: () => {
        toast.error('No se pudo eliminar la categoría.')
      },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar categorías..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={openCreate}>
          <Plus />
          Nueva categoría
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <TableRow key={categoria.id}>
              <TableCell>{categoria.id}</TableCell>
              <TableCell>{categoria.nombre ?? '-'}</TableCell>
              <TableCell>{categoria.descripcion ?? '-'}</TableCell>
              <TableCell>
                {new Date(categoria.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Editar categoría"
                  onClick={() => openEdit(categoria)}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar categoría"
                  onClick={() => openDelete(categoria)}
                >
                  <Trash />
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
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategoria ? 'Editar categoría' : 'Nueva categoría'}
            </DialogTitle>
          </DialogHeader>
          <FormCategoria
            categoria={editingCategoria}
            onSuccess={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={deletingCategoria !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingCategoria(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la categoría "{deletingCategoria?.nombre}" y
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteCategoria.isPending}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
