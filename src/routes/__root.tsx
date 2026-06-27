import { createRootRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { Toaster } from '@/components/ui/sonner'
import { getStoredSession } from '@/lib/auth-storage'
import { puedeAccederA } from '@/lib/permissions'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const session = getStoredSession()
    if (!session && location.pathname !== '/login') {
      throw redirect({ to: '/login' })
    }
    if (session && location.pathname !== '/login' && !puedeAccederA(session.rolNombre, location.pathname)) {
      throw redirect({ to: '/' })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const { pathname } = useLocation()

  if (pathname === '/login') {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    )
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
