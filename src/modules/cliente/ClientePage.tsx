import { PageHeader } from '@/components/layout/page-header'
import { ListClientes } from '@/modules/cliente/components/ListClientes'

function ClientePage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Clientes"
        description="Historial de compras y programa de fidelización."
      />
      <ListClientes />
    </div>
  )
}

export default ClientePage
