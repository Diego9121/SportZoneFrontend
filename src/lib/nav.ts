import type { NavGroup, NavItem, NavParentItem } from '@/types/nav'
import { isNavParentItem } from '@/types/nav'
import { puedeAccederA } from '@/lib/permissions'

export function isNavLeafActive(pathname: string, url: string): boolean {
  if (url === '/') return pathname === '/'
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (isNavParentItem(item)) {
    return item.items.some((child) => isNavLeafActive(pathname, child.url))
  }
  return isNavLeafActive(pathname, item.url)
}

export function getActiveParentTitles(
  pathname: string,
  items: NavItem[],
): string[] {
  return items
    .filter(
      (item): item is NavParentItem =>
        isNavParentItem(item) && isNavItemActive(pathname, item),
    )
    .map((item) => item.title)
}

// Oculta del menú lateral los grupos/items a los que el rol del usuario no tiene acceso.
// Usa la misma regla (puedeAccederA) que protege las rutas, así el menú nunca queda
// desincronizado con lo que el usuario realmente puede abrir.
export function filterNavGroupsByRole(groups: NavGroup[], rolNombre: string): NavGroup[] {
  return groups
    .map((group) => {
      const items = group.items
        .map((item): NavItem | null => {
          if (isNavParentItem(item)) {
            const subItems = item.items.filter((sub) => puedeAccederA(rolNombre, sub.url))
            return subItems.length > 0 ? { ...item, items: subItems } : null
          }
          return puedeAccederA(rolNombre, item.url) ? item : null
        })
        .filter((item): item is NavItem => item !== null)

      return { ...group, items }
    })
    .filter((group) => group.items.length > 0)
}

export function findActiveNavTitle(
  pathname: string,
  groups: NavGroup[],
): string | undefined {
  for (const group of groups) {
    for (const item of group.items) {
      if (isNavParentItem(item)) {
        const child = item.items.find((sub) => isNavLeafActive(pathname, sub.url))
        if (child) return `${item.title} / ${child.title}`
      } else if (isNavLeafActive(pathname, item.url)) {
        return item.title
      }
    }
  }
  return undefined
}
