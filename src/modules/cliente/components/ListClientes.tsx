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
import { useClientes } from '@/modules/cliente/hooks/use-cliente'
import type { Cliente } from '../schemas/cliente.schema'
import { useDeleteCliente } from '../hooks/use-cliente'
import FormCliente from './FormCliente'

export function ListClientes() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, error } = useClientes(page, pageSize, filter)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null)
  const deleteClienteId = useDeleteCliente()
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(
    undefined,
  )

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando clientes...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const clientes = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  function openDelete(cliente: Cliente) {
    setDeletingCliente(cliente)
  }
  function confirmDelete() {
    if (!deletingCliente) return
    deleteClienteId.mutate(deletingCliente.id, {
      onSuccess: () => {
        toast.success('Cliente eliminado correctamente.')
        setDeletingCliente(null)
      },
      onError: () => {
        toast.error('No se pudo eliminar el cliente.')
      },
    })
  }
  function openCreate() {
    setEditingCliente(undefined)
    setFormOpen(true)
  }

  function openEdit(cliente: Cliente) {
    setEditingCliente(cliente)
    setFormOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar clientes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={openCreate}>
          <Plus />
          Nuevo cliente
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo doc.</TableHead>
            <TableHead>N° documento</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 inset-ring inset-ring-blue-400/30">
                  {cliente.nombre}
                </span>
              </TableCell>
              <TableCell>{cliente.tipoDocumento}</TableCell>
              <TableCell>{cliente.documento}</TableCell>
              <TableCell>{cliente.telefono ?? '-'}</TableCell>
              <TableCell>{cliente.email ?? '-'}</TableCell>
              <TableCell>{cliente.direccion ?? '-'}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar cliente"
                  onClick={() => openDelete(cliente)}
                >
                  <Trash />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Editar cliente"
                  onClick={() => openEdit(cliente)}
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
        open={deletingCliente !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingCliente(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al cliente "{deletingCliente?.nombre}" y
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteClienteId.isPending}
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
              {editingCliente ? 'Editar cliente' : 'Nuevo cliente'}
            </DialogTitle>
          </DialogHeader>
          <FormCliente
            cliente={editingCliente}
            onSuccess={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
