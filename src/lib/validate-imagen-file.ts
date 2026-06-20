const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateImagenFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato no soportado. Usa JPG, PNG, WEBP o GIF.'
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'La imagen no puede superar los 5 MB.'
  }
  return null
}
