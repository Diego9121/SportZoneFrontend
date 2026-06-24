import { useLocation } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { sidebarMenu } from '@/components/layout/sidebar-menu'
import { findActiveNavTitle } from '@/lib/nav'
import { useAuth } from '@/modules/auth/hooks/use-auth'

export function SiteHeader() {
  const { pathname } = useLocation()
  const title = findActiveNavTitle(pathname, sidebarMenu) ?? 'Sport Zone'
  const { session, isAuthenticated } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="flex-1 text-sm font-medium">{title}</h1>
      <ModeToggle />
      {isAuthenticated && session && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{session.nombre}</span>
          <Badge variant="secondary">{session.rolNombre}</Badge>
        </div>
      )}
    </header>
  )
}
