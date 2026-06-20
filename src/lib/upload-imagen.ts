import { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import { apiResponseSchema } from '@/schemas/api-response.schema'

const imagenUploadResponseSchema = apiResponseSchema(z.object({ url: z.string() }))

export async function uploadImagen(file: File, carpeta = 'general'): Promise<string> {
  const formData = new FormData()
  formData.append('archivo', file)

  const { data } = await apiClient.post('/Imagenes', formData, {
    params: { carpeta },
  })

  return imagenUploadResponseSchema.parse(data).data.url
}
