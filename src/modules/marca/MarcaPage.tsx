import { PageHeader } from '@/components/layout/page-header'
import { ListMarcas } from '@/modules/marca/components/ListMarcas'

function MarcaPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Marcas"
        description="Listado de marcas de calzado e implementos deportivos."
      />
      <ListMarcas />
    </div>
  )
}

export default MarcaPage
