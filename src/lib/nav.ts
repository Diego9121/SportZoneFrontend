import type { NavGroup, NavItem, NavParentItem } from '@/types/nav'
import { isNavParentItem } from '@/types/nav'

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
