import type { LucideIcon } from 'lucide-react'

export interface NavLeafItem {
  title: string
  url: string
  icon?: LucideIcon
}

export interface NavParentItem {
  title: string
  icon?: LucideIcon
  items: NavLeafItem[]
}

export type NavItem = NavLeafItem | NavParentItem

export interface NavGroup {
  label: string
  items: NavItem[]
}

export function isNavParentItem(item: NavItem): item is NavParentItem {
  return 'items' in item
}
