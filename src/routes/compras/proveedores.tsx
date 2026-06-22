import { createFileRoute } from '@tanstack/react-router'
import ProveedorPage from '@/modules/proveedor/ProveedorPage'

export const Route = createFileRoute('/compras/proveedores')({
  component: ProveedorPage,
})
