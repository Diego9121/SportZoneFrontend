import { PageHeader } from '@/components/layout/page-header'
import { ListVariantes } from '@/modules/variante/components/ListVariantes'

function VariantePage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Variantes de Artículos"
        description="Talla (US/EU/UK/CM), color y stock por modelo."
      />
      <ListVariantes />
    </div>
  )
}

export default VariantePage
