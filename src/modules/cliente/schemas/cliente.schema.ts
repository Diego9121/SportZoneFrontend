import { z } from 'zod'
import { apiResponseSchema, paginatedSchema } from '@/schemas/api-response.schema'

export const clienteSchema = z.object({
  id: z.number(),
  tipoDocumento: z.string(),
  documento: z.string(),
  nombre: z.string(),
  telefono: z.string().nullable(),
  email: z.string().nullable(),
  direccion: z.string().nullable(),
  createdAt: z.string(),
})

export type Cliente = z.infer<typeof clienteSchema>

export const clientesResponseSchema = apiResponseSchema(
  paginatedSchema(clienteSchema),
)

export type ClientesResponse = z.infer<typeof clientesResponseSchema>

export const clienteResponseSchema = apiResponseSchema(clienteSchema)

export type ClienteResponse = z.infer<typeof clienteResponseSchema>
