import { createFileRoute } from '@tanstack/react-router'
import IngresoListPage from '@/modules/ingreso/IngresoListPage'

export const Route = createFileRoute('/compras/')({
  component: IngresoListPage,
})
