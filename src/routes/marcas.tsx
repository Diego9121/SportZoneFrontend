import { createFileRoute } from '@tanstack/react-router'
import MarcaPage from '@/modules/marca/MarcaPage'

export const Route = createFileRoute('/marcas')({
  component: MarcaPage,
})

