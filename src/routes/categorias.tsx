import { createFileRoute } from '@tanstack/react-router'
import CategoriaPage from '@/modules/categoria/CategoriaPage'

export const Route = createFileRoute('/categorias')({
  component: CategoriaPage,
})

