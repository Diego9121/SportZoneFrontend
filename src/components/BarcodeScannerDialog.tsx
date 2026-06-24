import { useCallback, useEffect, useRef, useState } from 'react'
import Quagga from '@ericblade/quagga2'
import type { QuaggaJSCodeReader, QuaggaJSResultObject } from '@ericblade/quagga2'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BarcodeScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  readers: QuaggaJSCodeReader[]
  onScan: (text: string) => void
}

function BarcodeScannerDialog({
  open,
  onOpenChange,
  title,
  readers,
  onScan,
}: BarcodeScannerDialogProps) {
  // Igual que con el video de zxing: usamos estado en vez de useRef para
  // reaccionar cuando Radix monta el DialogContent de forma asíncrona.
  const [viewportEl, setViewportEl] = useState<HTMLDivElement | null>(null)
  const viewportCallbackRef = useCallback((node: HTMLDivElement | null) => {
    setViewportEl(node)
  }, [])

  const readersRef = useRef(readers)
  const onScanRef = useRef(onScan)
  const onOpenChangeRef = useRef(onOpenChange)

  useEffect(() => {
    readersRef.current = readers
    onScanRef.current = onScan
    onOpenChangeRef.current = onOpenChange
  })

  useEffect(() => {
    if (!open || !viewportEl) return

    let cancelled = false

    function handleDetected(result: QuaggaJSResultObject) {
      const code = result.codeResult.code
      if (!code) return
      onScanRef.current(code)
      onOpenChangeRef.current(false)
    }

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: viewportEl,
          // "environment" como string es una preferencia (ideal), no estricta:
          // si el dispositivo solo tiene una cámara (laptop), no falla.
          constraints: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        decoder: {
          readers: readersRef.current,
        },
        locate: true,
        canvas: {
          createOverlay: false,
        },
      },
      (err) => {
        if (cancelled) return
        if (err) {
          toast.error('No se pudo acceder a la cámara.')
          onOpenChangeRef.current(false)
          return
        }
        Quagga.start()
        Quagga.onDetected(handleDetected)
      },
    )

    return () => {
      cancelled = true
      Quagga.offDetected(handleDetected)
      Quagga.stop()
    }
  }, [open, viewportEl])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div
          ref={viewportCallbackRef}
          className="relative aspect-video w-full overflow-hidden rounded-md bg-black [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        />
      </DialogContent>
    </Dialog>
  )
}

export default BarcodeScannerDialog
