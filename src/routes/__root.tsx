import { createRootRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { Toaster } from '@/components/ui/sonner'
import { getStoredSession } from '@/lib/auth-storage'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const isAuthenticated = getStoredSession() !== null
    if (!isAuthenticated && location.pathname !== '/login') {
      throw redirect({ to: '/login' })
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
