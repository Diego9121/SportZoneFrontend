import { PageHeader } from '@/components/layout/page-header'
import { ListCategorias } from '@/modules/categoria/components/ListCategorias'

function CategoriaPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Categorías"
        description="Clasificación de calzado e implementos deportivos."
      />
      <ListCategorias />
    </div>
  )
}

export default CategoriaPage
