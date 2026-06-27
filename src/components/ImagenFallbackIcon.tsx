import { Icon } from '@iconify/react'

interface ImagenFallbackIconProps {
  className?: string
}

function ImagenFallbackIcon({ className }: ImagenFallbackIconProps) {
  return (
    <Icon
      icon="emojione-monotone:running-shoe"
      className={className ?? 'h-6 w-6 text-muted-foreground'}
    />
  )
}

export default ImagenFallbackIcon
