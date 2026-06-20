import { useMemo, useState } from 'react'
import { BarcodeFormat } from '@zxing/library'
import { Barcode, QrCode } from 'lucide-react'
import { toast } from 'sonner'

import CameraScannerDialog from '@/components/CameraScannerDialog'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { PageHeader } from '@/components/layout/page-header'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useAllArticulos, useArticuloDetalle } from '@/modules/articulo/hooks/use-articulo'
import { useAllVariantes, useVarianteByCodigoBarras } from '@/modules/variante/hooks/use-variante'
import type { Variante } from '@/modules/variante/schemas/variante.schema'
import InfoArticulos from './components/InfoArticulos'
import InfoVariante from './components/InfoVariante'

const BARCODE_FORMATS = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.CODE_128,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
]

function extractIdFromScannedUrl(text: string): number | null {
  try {
    const url = new URL(text)
    const segments = url.pathname.split('/').filter(Boolean)
    const last = segments.at(-1)
    const id = last ? Number(last) : Number.NaN
    return Number.isInteger(id) ? id : null
  } catch {
    return null
  }
}

function ArticulosBuscadorTab() {
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedArticuloId, setSelectedArticuloId] = useState<number | undefined>(undefined)

  const { data: articulosData } = useAllArticulos()
  const articulos = useMemo(() => articulosData?.data.items ?? [], [articulosData])
  const articuloItems = useMemo(
    () =>
      articulos.map((articulo) => ({
        value: articulo.id,
        label: `${articulo.nombre} (${articulo.codigo})`,
      })),
    [articulos],
  )
  const selectedItem =
    articuloItems.find((item) => item.value === selectedArticuloId) ?? null

  const { data: detalleData, isLoading, isError } = useArticuloDetalle(selectedArticuloId)
  const detalle = detalleData?.data

  function handleQrScan(text: string) {
    const id = extractIdFromScannedUrl(text)
    if (id === null) {
      toast.error('El código QR no contiene un artículo válido.')
      return
    }
    setSelectedArticuloId(id)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Combobox
          items={articuloItems}
          value={selectedItem}
          onValueChange={(item) => setSelectedArticuloId(item ? item.value : undefined)}
          isItemEqualToValue={(a, b) => a.value === b.value}
        >
          <ComboboxInput
            className="flex-1"
            placeholder="Busca un artículo por nombre o código"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No se encontraron artículos.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Escanear código QR"
          onClick={() => setQrDialogOpen(true)}
        >
          <QrCode />
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando artículo...</p>}
      {isError && <p className="text-sm text-destructive">No se pudo cargar el artículo.</p>}

      {detalle && (
        <>
          <InfoArticulos articulo={detalle} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {detalle.variantes.map((variante) => (
              <InfoVariante key={variante.id} variante={variante} compact />
            ))}
          </div>
        </>
      )}

      <CameraScannerDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        title="Escanear código QR"
        formats={[BarcodeFormat.QR_CODE]}
        onScan={handleQrScan}
      />
    </div>
  )
}

function VariantesBuscadorTab() {
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false)
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(null)

  const { data: variantesData } = useAllVariantes()
  const variantes = useMemo(() => variantesData?.data.items ?? [], [variantesData])
  const varianteItems = useMemo(
    () =>
      variantes.map((variante) => ({
        value: variante.id,
        label: `${variante.articuloNombre} · ${variante.color ?? 'Sin color'} · US ${variante.tallaUs ?? '-'} (${variante.codigoBarras ?? 'sin código'})`,
      })),
    [variantes],
  )
  const selectedItem =
    varianteItems.find((item) => item.value === selectedVariante?.id) ?? null

  const buscarPorCodigoBarras = useVarianteByCodigoBarras()

  function handleComboboxChange(item: { value: number; label: string } | null) {
    if (!item) {
      setSelectedVariante(null)
      return
    }
    setSelectedVariante(variantes.find((v) => v.id === item.value) ?? null)
  }

  function handleBarcodeScan(text: string) {
    buscarPorCodigoBarras.mutate(text, {
      onSuccess: (response) => setSelectedVariante(response.data),
      onError: () => toast.error('No se encontró ninguna variante con ese código.'),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Combobox
          items={varianteItems}
          value={selectedItem}
          onValueChange={handleComboboxChange}
          isItemEqualToValue={(a, b) => a.value === b.value}
        >
          <ComboboxInput
            className="flex-1"
            placeholder="Busca una variante por artículo, color o código"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>No se encontraron variantes.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Escanear código de barras"
          onClick={() => setBarcodeDialogOpen(true)}
        >
          <Barcode />
        </Button>
      </div>

      {selectedVariante && <InfoVariante variante={selectedVariante} />}

      <CameraScannerDialog
        open={barcodeDialogOpen}
        onOpenChange={setBarcodeDialogOpen}
        title="Escanear código de barras"
        formats={BARCODE_FORMATS}
        onScan={handleBarcodeScan}
      />
    </div>
  )
}

function BuscarArticulosPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Buscar artículos y variantes"
        description="Busca por nombre/código o escanea un QR / código de barras."
      />
      <Tabs defaultValue="articulos">
        <TabsList>
          <TabsTrigger value="articulos">Artículos</TabsTrigger>
          <TabsTrigger value="variantes">Variantes</TabsTrigger>
        </TabsList>
        <TabsContent value="articulos">
          <ArticulosBuscadorTab />
        </TabsContent>
        <TabsContent value="variantes">
          <VariantesBuscadorTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BuscarArticulosPage
