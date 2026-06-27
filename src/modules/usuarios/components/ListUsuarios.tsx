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

import { useDeleteUsuario, UseObtenerUsuarios } from '../hooks/use-usuario'
import type { Usuarios } from '../schemas/usuarioSchema'
import FormUsuario from './FormUsuario'


function ListUsuarios() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, error } = UseObtenerUsuarios(page, pageSize, filter)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingUsuarios, setDeletingUsuarios] = useState<Usuarios | null>(null,)
  const deleteUsuariosId = useDeleteUsuario()
  const [editingUsuario, setEditingUsuario] = useState<Usuarios | undefined>(undefined)

  const usuarios = data?.data.items ?? []
  const totalPages = data?.data.totalPages ?? 1

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }
  // AQUI INICIA LA LOGICA PARA ELIMINAR UN USUARIO
  function openDelete(usuario: Usuarios) {
    setDeletingUsuarios(usuario)
  }

  function confirmDelete() {
    if (!deletingUsuarios) return
    deleteUsuariosId.mutate(deletingUsuarios.id, {
      onSuccess: () => {
        toast.success('Usuario eliminado correctamente.')
        setDeletingUsuarios(null)
      },
      onError: () => {
        toast.error('No se pudo eliminar el usuario.')
      },
    })
  }
  //AQUI TERMINA LA LOGICA PARA ELIMINAR UN USUARIO

  function openCreate() {
    setEditingUsuario(undefined)
    setFormOpen(true)
  }

  function openEdit(usuario: Usuarios) {
    setEditingUsuario(usuario)
    setFormOpen(true)
  }

  return (
    <div>
      {/*ESTA ES LA SECCION DE BUSCAR USUARIOS Y EL BOTON DE REAR*/}
      <div className="flex items-center justify-between">
        <InputGroup className="w-[300px]">
          <InputGroupInput
            id="input-group-url"
            placeholder="Buscar usuarios..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={openCreate}>
          <Plus />
          Nuevo usuario
        </Button>
      </div>
      {/*AQUI TERMINA LA SECCION DE BUSCAR Y CREAR*/}

      {/*AQUI EMPIEZA LA SECCION DE LA LISTA DE USUARIOS*/}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Nombre del Rol</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>

              <TableCell>{usuario.nombre ?? '-'}</TableCell>
              <TableCell>{usuario.email ?? '-'}</TableCell>
              <TableCell>{usuario.rolNombre ?? '-'}</TableCell>
              <TableCell>
                {new Date(usuario.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Eliminar usuario"
                  onClick={() => openDelete(usuario)}
                > <Trash />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Editar usuario"
                  onClick={() => openEdit(usuario)}
                >
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/*AQUI TERMINA LA SECCION DE LA LISTA DE USUARIOS*/}

      {/*AQUI EMPIEZA LA SECCION DE PAGINADO*/}
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
      {/*AQUI TERMINA LA SECCION DE PAGINADO*/}


      {/*ESTE ES EL COMPONENTE PARA ABRIR LA ALERA DE ELIMINAR USUARIOS*/}
      <AlertDialog
        open={deletingUsuarios !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingUsuarios(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al usuario "{deletingUsuarios?.nombre}" y
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteUsuariosId.isPending}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*AQUI TERMINA EL COMPONENTE PARA ELIMINAR USUARIOS*/}

      {/*ESTE ES EL DIALOG PARA CREAR/EDITAR USUARIOS*/}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUsuario ? 'Editar usuario' : 'Nuevo usuario'}
            </DialogTitle>
          </DialogHeader>
          <FormUsuario
            usuario={editingUsuario}
            onSuccess={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      {/*AQUI TERMINA EL DIALOG PARA CREAR/EDITAR USUARIOS*/}

    </div>
  )
}

export default ListUsuarios
