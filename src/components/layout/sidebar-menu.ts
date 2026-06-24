import {
  BadgeCheck,
  LayoutDashboard,
  Layers,
  List,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Warehouse,
  QrCode,
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
    ],
  },
  {
    label: 'Inventario',
    items: [
      {
        title: 'Almacenes',
        icon: Warehouse,
        items: [
          { title: 'Lista de Modelos', url: '/articulos', icon: List },
          { title: 'Lista de T/C', url: '/articulos/variantes', icon: Layers },
          { title: 'Búsqueda de Artículos', url: '/almacenes/consulta', icon: QrCode },
        ],
      },
      { title: 'Compras', icon: Truck, 

        items: [
          { title: 'Listado', url: '/compras', icon: List },
          { title: 'Crear Compra', url: '/compras/crear', icon: ShoppingCart },
          { title: 'Proveedores', url: '/compras/proveedores', icon: Truck },
        ],
       },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { title: 'Lista de Ventas', url: '/ventas', icon: List },
      { title: 'Crear Ventas', url: '/ventas/crear', icon: ShoppingCart },
      { title: 'Clientes', url: '/clientes', icon: Users },
    ],
  },
  {
    label: 'Reportes',
    items: [{ title: 'Generar Reportes', url: '/reportes', icon: List }],
  },
]
