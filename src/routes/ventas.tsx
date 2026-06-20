import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/ventas')({
  component: VentasPage,
})

function VentasPage() {
  return (
    <PageHeader
      title="Ventas"
      description="Registro de ventas y comprobantes por vendedor."
    />
  )
}
