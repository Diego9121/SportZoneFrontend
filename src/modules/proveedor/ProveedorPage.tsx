import { PageHeader } from '@/components/layout/page-header'
import { ListProveedores } from '@/modules/proveedor/components/ListProveedores'

function ProveedorPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Proveedores"
        description="Proveedores asociados a las compras de mercancía."
      />
      <ListProveedores />
    </div>
  )
}

export default ProveedorPage
