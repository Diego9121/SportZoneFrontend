import { useNavigate } from '@tanstack/react-router'
import { PageHeader } from '@/components/layout/page-header'
import FormIngreso from '@/modules/ingreso/components/FormIngreso'

function IngresoCrearPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Nuevo ingreso"
        description="Registra la mercancía recibida de un proveedor."
      />
      <FormIngreso onSuccess={() => navigate({ to: '/compras' })} />
    </div>
  )
}

export default IngresoCrearPage
