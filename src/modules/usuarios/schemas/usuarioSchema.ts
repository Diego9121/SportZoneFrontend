import { apiResponseSchema, paginatedSchema } from "@/schemas/api-response.schema";
import z from "zod";

export const usuarioSchema = z.object({
  id : z.number(),
  nombre: z.string(),
  email: z.string(),
  activo: z.boolean(),
  ultimoAcceso: z.string().nullable(),
  rolId: z.number(),
  rolNombre: z.string(),
  createdAt: z.string(),
});

export const usuariosResponseSchema = apiResponseSchema(
  paginatedSchema(usuarioSchema),
)

export const usuarioResponseSchema = apiResponseSchema(usuarioSchema)

export type Usuarios = z.infer<typeof usuarioSchema>
export type UsuarioResponse = z.infer<typeof usuarioResponseSchema>
export type UsuariosResponse = z.infer<typeof usuariosResponseSchema>