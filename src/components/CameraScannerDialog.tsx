import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { DecodeHintType, type BarcodeFormat } from '@zxing/library'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CameraScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  formats: BarcodeFormat[]
  onScan: (text: string) => void
}

function CameraScannerDialog({
  open,
  onOpenChange,
  title,
  formats,
  onScan,
}: CameraScannerDialogProps) {
  // En vez de useRef, guardamos el nodo en estado para poder reaccionar
  // cuando React lo monta de verdad (Radix monta DialogContent de forma
  // asíncrona, así que videoRef.current podía seguir siendo null cuando
  // el useEffect corría).
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    setVideoEl(node)
  }, [])

  // Refs para no reiniciar la cámara cada vez que el padre re-renderiza con
  // un array `formats` o callbacks nuevos; el efecto solo depende de
  // `open` y `videoEl`.
  const formatsRef = useRef(formats)
  const onScanRef = useRef(onScan)
  const onOpenChangeRef = useRef(onOpenChange)

  useEffect(() => {
    formatsRef.current = formats
    onScanRef.current = onScan
    onOpenChangeRef.current = onOpenChange
  })

  useEffect(() => {
    // Solo arrancamos cuando el modal está abierto Y el <video> ya
    // existe en el DOM. Mientras Radix sigue animando, videoEl es null
    // y este efecto no hace nada (se reejecutará en cuanto cambie).
    if (!open || !videoEl) return

    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formatsRef.current)
    const reader = new BrowserMultiFormatReader(hints)
    let cancelled = false
    let controls: IScannerControls | undefined

    reader
      .decodeFromVideoDevice(undefined, videoEl, (result) => {
        if (!result) return
        onScanRef.current(result.getText())
        onOpenChangeRef.current(false)
      })
      .then((c) => {
        if (cancelled) {
          c.stop()
          return
        }
        controls = c
      })
      .catch(() => {
        toast.error('No se pudo acceder a la cámara.')
        onOpenChangeRef.current(false)
      })

    return () => {
      cancelled = true
      controls?.stop()
    }
  }, [open, videoEl])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <video
          ref={videoCallbackRef}
          className="w-full rounded-md bg-black"
          autoPlay
          playsInline
          muted
        />
      </DialogContent>
    </Dialog>
  )
}

export default CameraScannerDialog