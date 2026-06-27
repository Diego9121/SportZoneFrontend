import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Camera, ImagePlus, Loader2, Trash } from 'lucide-react'
import { toast } from 'sonner'

import ImagenFallbackIcon from '@/components/ImagenFallbackIcon'
import { Button } from '@/components/ui/button'
import { useUploadImagen } from '@/hooks/use-upload-imagen'
import { validateImagenFile } from '@/lib/validate-imagen-file'

interface ImageUploadFieldProps {
  value: string
  onChange: (url: string) => void
  carpeta?: string
  disabled?: boolean
}

function ImageUploadField({ value, onChange, carpeta = 'general', disabled }: ImageUploadFieldProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadImagenMutation = useUploadImagen(carpeta)
  const isUploading = uploadImagenMutation.isPending
  const isDisabled = disabled || isUploading

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const validationError = validateImagenFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      const url = await uploadImagenMutation.mutateAsync(file)
      onChange(url)
      toast.success('Imagen subida correctamente.')
    } catch {
      toast.error('No se pudo subir la imagen.')
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border bg-muted">
        {value ? (
          <img src={value} alt="Vista previa" className="h-full w-full object-contain" />
        ) : (
          <ImagenFallbackIcon className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDisabled}
            onClick={() => galleryInputRef.current?.click()}
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            Subir de galería
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDisabled}
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera />
            Usar cámara
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              aria-label="Quitar imagen"
              onClick={() => onChange('')}
            >
              <Trash />
            </Button>
          )}
        </div>
        {isUploading && (
          <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
        )}
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={isDisabled}
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        disabled={isDisabled}
        onChange={handleFileChange}
      />
    </div>
  )
}

export default ImageUploadField
