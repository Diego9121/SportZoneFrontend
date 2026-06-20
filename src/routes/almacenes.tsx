import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'

export const Route = createFileRoute('/almacenes')({
  component: AlmacenesPage,
})

function AlmacenesPage() {
  return (
    <PageHeader
      title="Almacenes"
      description="Bodegas y puntos de stock disponibles."
    />
  )
}
