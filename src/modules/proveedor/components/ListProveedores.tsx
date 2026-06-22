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
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useProveedores } from '@/modules/proveedor/hooks/use-proveedor'
import type { Proveedor } from '../schemas/proveedor.schema'
import { useDeleteProveedor } from '../hooks/use-proveedor'
import FormProveedor from './FormProveedor'

export function ListProveedores() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, error } = useProveedores(page, pageSize, filter)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingProveedor, setDeletingProveedor] = useState<Proveedor | null>(null)
  const deleteProveedorId = useDeleteProveedor()
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>(
    undefined,
  )

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando proveedores...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const proveedores = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  function openDelete(proveedor: Proveedor) {
    setDeletingProveedor(proveedor)
  }
  function confirmDelete() {
    if (!deletingProveedor) return
    deleteProveedorId.mutate(deletingProveedor.id, {
      onSuccess: () => {
        toast.success('Proveedor eliminado correctamente.')
        setDeletingProveedor(null)
      },
      onError: () => {
        toast.error('No se pudo eliminar el proveedor.')
      },
    })
  }
  function openCreate() {
    setEditingProveedor(undefined)
    setFormOpen(true)
  }

  function openEdit(proveedor: Proveedor) {
    setEditingProveedor(proveedor)
    setFormOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar proveedores..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={openCreate}>
          <Plus />
          Nuevo proveedor
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.id}>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                  {proveedor.nombre}
                </span>
              </TableCell>
              <TableCell>{proveedor.contacto ?? '-'}</TableCell>
              <TableCell>{proveedor.telefono ?? '-'}</TableCell>
              <TableCell>{proveedor.email ?? '-'}</TableCell>
              <TableCell>{proveedor.direccion ?? '-'}</TableCell>
              <TableCell>
                {new Date(proveedor.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar proveedor"
                  onClick={() => openDelete(proveedor)}
                >
                  <Trash />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Editar proveedor"
                  onClick={() => openEdit(proveedor)}
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
        open={deletingProveedor !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingProveedor(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el proveedor "{deletingProveedor?.nombre}" y
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteProveedorId.isPending}
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
              {editingProveedor ? 'Editar proveedor' : 'Nuevo proveedor'}
            </DialogTitle>
          </DialogHeader>
          <FormProveedor
            proveedor={editingProveedor}
            onSuccess={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
