import { createFileRoute } from '@tanstack/react-router'
import ClientePage from '@/modules/cliente/ClientePage'

export const Route = createFileRoute('/clientes')({
  component: ClientePage,
})
