import { useCallback, useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface QrScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onScan: (text: string) => void
}

function QrScannerDialog({ open, onOpenChange, title, onScan }: QrScannerDialogProps) {
  // Igual que con zxing antes: estado en vez de useRef para reaccionar
  // cuando Radix monta el DialogContent de forma asíncrona.
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    setVideoEl(node)
  }, [])

  const onScanRef = useRef(onScan)
  const onOpenChangeRef = useRef(onOpenChange)

  useEffect(() => {
    onScanRef.current = onScan
    onOpenChangeRef.current = onOpenChange
  })

  useEffect(() => {
    if (!open || !videoEl) return

    const scanner = new QrScanner(
      videoEl,
      (result) => {
        onScanRef.current(result.data)
        onOpenChangeRef.current(false)
      },
      {
        // "environment" es una preferencia: en laptops con una sola cámara
        // (frontal) qr-scanner cae automáticamente a la disponible.
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      },
    )

    scanner.start().catch(() => {
      toast.error('No se pudo acceder a la cámara.')
      onOpenChangeRef.current(false)
    })

    return () => {
      scanner.destroy()
    }
  }, [open, videoEl])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
          <video
            ref={videoCallbackRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QrScannerDialog
