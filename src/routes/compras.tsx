import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/compras')({
  component: ComprasPage,
})

function ComprasPage() {
  return (
    <PageHeader
      title="Compras"
      description="Ingreso de mercancía asociado a proveedores."
    />
  )
}
