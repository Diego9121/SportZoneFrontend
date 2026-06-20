import { createFileRoute } from '@tanstack/react-router'
import VariantePage from '@/modules/variante/VariantePage'

export const Route = createFileRoute('/articulos/variantes')({
  component: VariantePage,
})
