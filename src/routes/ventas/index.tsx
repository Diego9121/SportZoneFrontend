import { createFileRoute } from '@tanstack/react-router'
import VentaListPage from '@/modules/venta/VentaListPage'

export const Route = createFileRoute('/ventas/')({
  component: VentaListPage,
})
