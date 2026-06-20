import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/articulos/variantes')({
  component: VariantesPage,
})

function VariantesPage() {
  return (
    <PageHeader
      title="Variantes de Artículos"
      description="Talla (US/EU/UK/CM), color y stock por modelo."
    />
  )
}
