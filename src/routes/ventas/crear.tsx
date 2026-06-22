import { createFileRoute } from '@tanstack/react-router'
import VentaPosPage from '@/modules/venta/VentaPosPage'

export const Route = createFileRoute('/ventas/crear')({
  component: VentaPosPage,
})
