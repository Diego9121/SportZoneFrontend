export interface SerieDiaria {
  date: string
  ventas: number
  compras: number
}

interface ItemConFecha {
  createdAt: string
  total: number
}

// Las ventas y compras llegan como listas de movimientos individuales (con su propio createdAt);
// el grafico necesita una serie por dia, asi que se agrupan y suman aqui.
export function agruparVentasYComprasPorDia(
  ventas: ItemConFecha[],
  compras: ItemConFecha[],
): SerieDiaria[] {
  const porDia = new Map<string, SerieDiaria>()

  function acumular(items: ItemConFecha[], campo: 'ventas' | 'compras') {
    for (const item of items) {
      const fecha = item.createdAt.slice(0, 10)
      const actual = porDia.get(fecha) ?? { date: fecha, ventas: 0, compras: 0 }
      actual[campo] += item.total
      porDia.set(fecha, actual)
    }
  }

  acumular(ventas, 'ventas')
  acumular(compras, 'compras')

  return Array.from(porDia.values()).sort((a, b) => a.date.localeCompare(b.date))
}
