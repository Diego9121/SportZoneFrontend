import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/articulos/')({
  component: ArticulosPage,
})

function ArticulosPage() {
  return (
    <PageHeader
      title="Artículos"
      description="Listado de modelos: marca, descripción y precio."
    />
  )
}
