import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/devoluciones')({
  component: DevolucionesPage,
})

function DevolucionesPage() {
  return (
    <PageHeader
      title="Devoluciones"
      description="Devoluciones de productos y ajuste de stock."
    />
  )
}
