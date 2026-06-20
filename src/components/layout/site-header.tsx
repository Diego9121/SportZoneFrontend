import { useLocation } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { sidebarMenu } from '@/components/layout/sidebar-menu'
import { findActiveNavTitle } from '@/lib/nav'

export function SiteHeader() {
  const { pathname } = useLocation()
  const title = findActiveNavTitle(pathname, sidebarMenu) ?? 'Sport Zone'

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-sm font-medium">{title}</h1>
    </header>
  )
}
