import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMarcas } from '@/modules/marca/hooks/use-marcas'

export function ListMarcas() {
  const { data, isLoading, isError, error } = useMarcas()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando marcas...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>
  }

  const marcas = data?.data.items ?? []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha de Creación</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marcas.map((marca) => (
          <TableRow key={marca.id}>
            <TableCell>{marca.id}</TableCell>
            <TableCell>{marca.nombre ?? '-'}</TableCell>
            <TableCell>{marca.descripcion ?? '-'}</TableCell>
            <TableCell>
              {new Date(marca.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
