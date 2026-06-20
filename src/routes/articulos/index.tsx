import { createFileRoute } from '@tanstack/react-router'
import ArticuloPage from '@/modules/articulo/ArticuloPage'

export const Route = createFileRoute('/articulos/')({
  component: ArticuloPage,
})
