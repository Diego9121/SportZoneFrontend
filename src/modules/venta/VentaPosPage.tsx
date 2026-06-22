import { useMemo, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Search } from 'lucide-react'
import { toast } from 'sonner'

import { buttonVariants } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { PageHeader } from '@/components/layout/page-header'
import { useCatalogoVariantes } from '@/modules/variante/hooks/use-variante'
import type { VarianteCatalogo } from '@/modules/variante/schemas/variante.schema'
import CarritoPanel, { type CartLine } from './components/CarritoPanel'
import CatalogoCard from './components/CatalogoCard'
import VentaTicketPdf from './components/VentaTicketPdf'
import { useCreateVenta, useVentaById } from './hooks/use-venta'

const CARDS_POR_PAGINA = 20

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size))
  return chunks
}

function VentaPosPage() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [clienteId, setClienteId] = useState(0)
  const [tipoComprobante, setTipoComprobante] = useState('factura')
  const [observacion, setObservacion] = useState('')
  const [ventaCreadaId, setVentaCreadaId] = useState<number | undefined>(undefined)

  const { data: catalogoData, isLoading } = useCatalogoVariantes()
  const catalogo = useMemo(() => catalogoData?.data.items ?? [], [catalogoData])

  const catalogoFiltrado = useMemo(() => {
    const texto = search.trim().toLowerCase()
    if (!texto) return catalogo
    return catalogo.filter(
      (variante) =>
        variante.articuloNombre.toLowerCase().includes(texto) ||
        (variante.color ?? '').toLowerCase().includes(texto) ||
        (variante.codigoBarras ?? '').toLowerCase().includes(texto),
    )
  }, [catalogo, search])

  const paginas = useMemo(
    () => chunk(catalogoFiltrado, CARDS_POR_PAGINA),
    [catalogoFiltrado],
  )

  const cantidadPorVarianteId = useMemo(
    () => new Map(cart.map((line) => [line.variante.id, line.cantidad])),
    [cart],
  )

  const createVenta = useCreateVenta()
  const { data: ventaCreadaData } = useVentaById(ventaCreadaId)
  const ventaCreada = ventaCreadaData?.data

  function handleAdd(variante: VarianteCatalogo) {
    setCart((current) => {
      const existente = current.find((line) => line.variante.id === variante.id)
      if (existente) {
        if (existente.cantidad >= variante.stock) {
          toast.error('No hay más stock disponible de esta variante.')
          return current
        }
        return current.map((line) =>
          line.variante.id === variante.id
            ? { ...line, cantidad: line.cantidad + 1 }
            : line,
        )
      }
      return [...current, { variante, cantidad: 1, descuento: 0 }]
    })
  }

  function handleUpdateCantidad(varianteId: number, cantidad: number) {
    setCart((current) =>
      current.map((line) =>
        line.variante.id === varianteId
          ? { ...line, cantidad: Math.max(1, Math.min(cantidad, line.variante.stock)) }
          : line,
      ),
    )
  }

  function handleUpdateDescuento(varianteId: number, descuento: number) {
    setCart((current) =>
      current.map((line) =>
        line.variante.id === varianteId ? { ...line, descuento: Math.max(0, descuento) } : line,
      ),
    )
  }

  function handleRemove(varianteId: number) {
    setCart((current) => current.filter((line) => line.variante.id !== varianteId))
  }

  function handleSubmit() {
    if (cart.length === 0) {
      toast.error('El carrito está vacío.')
      return
    }
    if (clienteId < 1) {
      toast.error('Selecciona un cliente.')
      return
    }

    createVenta
      .mutateAsync({
        clienteId,
        tipoComprobante,
        observacion: observacion.trim() === '' ? null : observacion,
        detalles: cart.map((line) => ({
          varianteId: line.variante.id,
          cantidad: line.cantidad,
          descuento: line.descuento,
        })),
      })
      .then((response) => {
        toast.success('Venta registrada correctamente.')
        setVentaCreadaId(response.data.id)
        setCart([])
        setClienteId(0)
        setObservacion('')
      })
      .catch(() => {
        toast.error('No se pudo registrar la venta.')
      })
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <PageHeader
        title="Crear venta"
        description="Busca artículos en el catálogo y agrégalos al carrito."
      />

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <InputGroup className="mb-4 max-w-sm">
            <InputGroupInput
              placeholder="Buscar modelos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>

          {isLoading && (
            <p className="text-sm text-muted-foreground">Cargando catálogo...</p>
          )}
          {!isLoading && catalogoFiltrado.length === 0 && (
            <p className="text-sm text-muted-foreground">No se encontraron artículos.</p>
          )}

          {paginas.length > 0 && (
            <Carousel className="px-10">
              <CarouselContent>
                {paginas.map((pagina, index) => (
                  <CarouselItem key={index}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {pagina.map((variante) => (
                        <CatalogoCard
                          key={variante.id}
                          variante={variante}
                          cantidadEnCarrito={cantidadPorVarianteId.get(variante.id) ?? 0}
                          onAdd={handleAdd}
                        />
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>

        <CarritoPanel
          cart={cart}
          onUpdateCantidad={handleUpdateCantidad}
          onUpdateDescuento={handleUpdateDescuento}
          onRemove={handleRemove}
          clienteId={clienteId}
          onClienteChange={setClienteId}
          tipoComprobante={tipoComprobante}
          onTipoComprobanteChange={setTipoComprobante}
          observacion={observacion}
          onObservacionChange={setObservacion}
          onSubmit={handleSubmit}
          isSubmitting={createVenta.isPending}
        />
      </div>

      <Dialog
        open={ventaCreadaId !== undefined}
        onOpenChange={(open) => {
          if (!open) setVentaCreadaId(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Venta registrada</DialogTitle>
          </DialogHeader>
          {ventaCreada ? (
            <PDFDownloadLink
              document={<VentaTicketPdf venta={ventaCreada} />}
              fileName={`ticket-${ventaCreada.numeroDoc ?? ventaCreada.id}.pdf`}
              className={buttonVariants({ variant: 'default' })}
            >
              {({ loading }) => (loading ? 'Generando ticket...' : 'Descargar ticket')}
            </PDFDownloadLink>
          ) : (
            <p className="text-sm text-muted-foreground">Preparando el ticket...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VentaPosPage
