import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/almacenes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/almacenes/"!</div>
}
