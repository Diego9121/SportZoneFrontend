export const SIMBOLO_MONEDA = 'Bs.'

export function formatMoneda(valor: number): string {
  return `${SIMBOLO_MONEDA} ${valor.toFixed(2)}`
}



export function formatMonedaCard(valor: number): string {
  const numero = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)

  return `${SIMBOLO_MONEDA} ${numero}`
}