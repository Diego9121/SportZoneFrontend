import UsuariosPage from '@/modules/usuarios/UsuariosPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/usuarios')({
  component: UsuariosPage,
})
