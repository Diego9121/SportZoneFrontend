import { PageHeader } from '@/components/layout/page-header'
import { ListIngresos } from '@/modules/ingreso/components/ListIngresos'

function IngresoListPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Compras"
        description="Ingresos de mercancía registrados a proveedores."
      />
      <ListIngresos />
    </div>
  )
}

export default IngresoListPage
