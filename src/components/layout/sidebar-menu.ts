import {
  BadgeCheck,
  LayoutDashboard,
  Layers,
  List,
  Package,
  ShoppingCart,
  Tags,
  Truck,
  Undo2,
  Users,
  Warehouse,
  FactoryIcon,
} from 'lucide-react'
import type { NavGroup } from '@/types/nav'

export const sidebarMenu: NavGroup[] = [
  {
    label: 'Principal',
    items: [{ title: 'Dashboard', url: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Catálogo',
    items: [
      { title: 'Categorías', url: '/categorias', icon: Tags },
      { title: 'Marcas', url: '/marcas', icon: BadgeCheck },
      {
        title: 'Artículos',
        icon: Package,
        items: [
          { title: 'Listado', url: '/articulos', icon: List },
          { title: 'Variantes', url: '/articulos/variantes', icon: Layers },
          { title: 'Fabricantes', url: '/articulos/fabricantes', icon: FactoryIcon},
        ],
      },
    ],
  },
  {
    label: 'Inventario',
    items: [
      { title: 'Almacenes', url: '/almacenes', icon: Warehouse },
      { title: 'Compras', url: '/compras', icon: Truck },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { title: 'Ventas', url: '/ventas', icon: ShoppingCart },
      { title: 'Devoluciones', url: '/devoluciones', icon: Undo2 },
      { title: 'Clientes', url: '/clientes', icon: Users },
    ],
  },
]
