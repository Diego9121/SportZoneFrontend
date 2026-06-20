import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/clientes')({
  component: ClientesPage,
})

function ClientesPage() {
  return (
    <PageHeader
      title="Clientes"
      description="Historial de compras y programa de fidelización."
    />
  )
}
