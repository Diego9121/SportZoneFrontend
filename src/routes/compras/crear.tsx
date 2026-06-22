import { createFileRoute } from '@tanstack/react-router'
import IngresoCrearPage from '@/modules/ingreso/IngresoCrearPage'

export const Route = createFileRoute('/compras/crear')({
  component: IngresoCrearPage,
})
