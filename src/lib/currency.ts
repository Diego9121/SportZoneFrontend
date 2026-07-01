export const SIMBOLO_MONEDA = 'Bs.'

export function formatMoneda(valor: number): string {
  return `${SIMBOLO_MONEDA} ${valor.toFixed(2)}`
}
