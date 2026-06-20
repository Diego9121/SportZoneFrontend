import { PageHeader } from '@/components/layout/page-header'
import { ListArticulos } from '@/modules/articulo/components/ListArticulos'

function ArticuloPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Artículos"
        description="Listado de modelos: marca, descripción y precio."
      />
      <ListArticulos />
    </div>
  )
}

export default ArticuloPage
