import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <PageHeader
      title="Dashboard"
      description="Resumen general de ventas, inventario y actividad de la tienda."
    />
  )
}
