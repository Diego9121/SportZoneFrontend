import { PageHeader } from '@/components/layout/page-header'
import { ListVentas } from '@/modules/venta/components/ListVentas'

function VentaListPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Ventas"
        description="Registro de ventas y comprobantes por vendedor."
      />
      <ListVentas />
    </div>
  )
}

export default VentaListPage
