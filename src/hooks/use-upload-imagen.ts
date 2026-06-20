import { useMutation } from '@tanstack/react-query'
import { uploadImagen } from '@/lib/upload-imagen'

export function useUploadImagen(carpeta = 'general') {
  return useMutation({
    mutationFn: (file: File) => uploadImagen(file, carpeta),
  })
}
