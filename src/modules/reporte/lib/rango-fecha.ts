// Los inputs type="date" entregan "YYYY-MM-DD"; el backend espera date-time ISO.
// "desde" se ancla al inicio del día y "hasta" al final, para que el filtro
// incluya todos los registros del día seleccionado.
export function toDesdeParam(value: string): string | undefined {
  return value ? `${value}T00:00:00` : undefined
}

export function toHastaParam(value: string): string | undefined {
  return value ? `${value}T23:59:59` : undefined
}
