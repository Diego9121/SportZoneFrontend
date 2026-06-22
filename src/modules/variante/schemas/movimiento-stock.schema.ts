import { z } from 'zod'
import { apiResponseSchema } from '@/schemas/api-response.schema'

export const movimientoStockSchema = z.object({
  id: z.number(),
  articuloVarianteId: z.number(),
  articuloVarianteDescripcion: z.string(),
  ingresoId: z.number().nullable(),
  ventaId: z.number().nullable(),
  tipoMovimiento: z.string(),
  cantidad: z.number(),
  numeroDoc: z.string().nullable(),
  createdAt: z.string(),
})

export type MovimientoStock = z.infer<typeof movimientoStockSchema>

// El endpoint devuelve un array plano en `data`, no paginado.
export const movimientosStockResponseSchema = apiResponseSchema(
  z.array(movimientoStockSchema),
)

export type MovimientosStockResponse = z.infer<typeof movimientosStockResponseSchema>
