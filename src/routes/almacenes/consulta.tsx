import BuscarArticulosPage from '@/modules/articulo/BuscarArticulosPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/almacenes/consulta')({
  component: BuscarArticulosPage,
})

