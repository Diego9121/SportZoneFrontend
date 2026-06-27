// Roles fijos del sistema (vienen de GET /api/Roles, que solo devuelve estos 3).
export const ROL_ADMINISTRADOR = 'Administrador'
export const ROL_VENDEDOR = 'Vendedor'
export const ROL_ALMACENES = 'Almacenes'

// Rutas a las que cualquier usuario autenticado puede entrar sin importar su rol.
const RUTAS_ABIERTAS = ['/', '/login']

// Prefijos de ruta permitidos por rol. El Administrador no necesita estar aquí:
// tiene acceso total. Lo que no esté listado para un rol queda denegado por defecto.
const PREFIJOS_POR_ROL: Record<string, string[]> = {
  [ROL_VENDEDOR]: ['/ventas', '/clientes', '/articulos', '/almacenes', '/reportes'],
  [ROL_ALMACENES]: ['/almacenes', '/articulos', '/compras', '/reportes'],
}

export function puedeAccederA(rolNombre: string, pathname: string): boolean {
  if (rolNombre === ROL_ADMINISTRADOR) return true
  if (RUTAS_ABIERTAS.includes(pathname)) return true

  const prefijos = PREFIJOS_POR_ROL[rolNombre] ?? []
  return prefijos.some((prefijo) => pathname === prefijo || pathname.startsWith(`${prefijo}/`))
}
