import { useState } from 'react'
import ImagenFallbackIcon from '@/components/ImagenFallbackIcon'

interface VarianteImagenProps {
  imagenUrl?: string | null
  articuloImagen?: string | null
  alt?: string
  iconClassName?: string
}

function VarianteImagen({ imagenUrl, articuloImagen, alt, iconClassName }: VarianteImagenProps) {
  const src = imagenUrl ?? articuloImagen ?? null

  const [srcConError, setSrcConError] = useState(false)
  const [srcAnterior, setSrcAnterior] = useState(src)
  if (src !== srcAnterior) {
    setSrcAnterior(src)
    setSrcConError(false)
  }

  if (!src || srcConError) {
    return <ImagenFallbackIcon className={iconClassName} />
  }

  return (
    <img
      src={src}
      alt={alt ?? 'Producto'}
      className="h-full w-full object-contain"
      onError={() => setSrcConError(true)}
    />
  )
}

export default VarianteImagen
