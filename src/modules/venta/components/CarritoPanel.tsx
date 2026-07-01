import { useMemo, useState } from 'react'
import { Minus, Plus, Trash } from 'lucide-react'
import { formatMoneda } from '@/lib/currency'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import FormCliente from '@/modules/cliente/components/FormCliente'
import { useClientes } from '@/modules/cliente/hooks/use-cliente'
import type { VarianteCatalogo } from '@/modules/variante/schemas/variante.schema'

export interface CartLine {
  variante: VarianteCatalogo
  cantidad: number
  descuento: number
}

const TIPOS_COMPROBANTE = [
  { value: 'factura', label: 'Factura' },
  { value: 'recibo', label: 'Recibo' },
]

interface CarritoPanelProps {
  cart: CartLine[]
  onUpdateCantidad: (varianteId: number, cantidad: number) => void
  onUpdateDescuento: (varianteId: number, descuento: number) => void
  onRemove: (varianteId: number) => void
  clienteId: number
  onClienteChange: (clienteId: number) => void
  tipoComprobante: string
  onTipoComprobanteChange: (tipo: string) => void
  observacion: string
  onObservacionChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

function CarritoPanel({
  cart,
  onUpdateCantidad,
  onUpdateDescuento,
  onRemove,
  clienteId,
  onClienteChange,
  tipoComprobante,
  onTipoComprobanteChange,
  observacion,
  onObservacionChange,
  onSubmit,
  isSubmitting,
}: CarritoPanelProps) {
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false)

  const { data: clientesData } = useClientes(1, 100)
  const clientes = useMemo(() => clientesData?.data.items ?? [], [clientesData])
  const clienteItems = useMemo(
    () =>
      clientes.map((cliente) => ({
        value: cliente.id,
        label: `${cliente.nombre} (${cliente.documento})`,
      })),
    [clientes],
  )
  const selectedClienteItem = clienteItems.find((item) => item.value === clienteId) ?? null

  const subtotal = cart.reduce((sum, line) => sum + line.cantidad * line.variante.precioVenta, 0)
  const descuentoTotal = cart.reduce((sum, line) => sum + line.descuento, 0)
  const total = subtotal - descuentoTotal

  return (
    <div className="flex w-full flex-col gap-4 lg:w-[360px] lg:shrink-0">
      <Field>
        <FieldLabel htmlFor="venta-cliente">Cliente</FieldLabel>
        <div className="flex gap-2">
          <Combobox
            items={clienteItems}
            value={selectedClienteItem}
            onValueChange={(item) => onClienteChange(item ? item.value : 0)}
            isItemEqualToValue={(a, b) => a.value === b.value}
          >
            <ComboboxInput
              id="venta-cliente"
              className="flex-1"
              placeholder="Selecciona un cliente"
            />
            <ComboboxContent>
              <ComboboxEmpty>No se encontraron clientes.</ComboboxEmpty>
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
            size="icon"
            variant="outline"
            aria-label="Nuevo cliente"
            onClick={() => setClienteDialogOpen(true)}
          >
            <Plus />
          </Button>
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="venta-tipo-comprobante">Tipo de comprobante</FieldLabel>
        <Select value={tipoComprobante} onValueChange={onTipoComprobanteChange}>
          <SelectTrigger id="venta-tipo-comprobante" className="w-full">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            {TIPOS_COMPROBANTE.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="venta-observacion">Observación</FieldLabel>
        <Input
          id="venta-observacion"
          value={observacion}
          onChange={(e) => onObservacionChange(e.target.value)}
          placeholder="Observación opcional"
        />
      </Field>

      <div className="flex flex-col gap-2 rounded-md border p-2">
        <p className="text-sm font-medium">Carrito</p>
        {cart.length === 0 && (
          <p className="text-sm text-muted-foreground">Agrega artículos desde el catálogo.</p>
        )}
        {cart.map((line) => (
          <div key={line.variante.id} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs leading-tight">
                {line.variante.articuloNombre} · {line.variante.color ?? 'Sin color'} · US{' '}
                {line.variante.tallaUs ?? '-'}
              </p>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Quitar del carrito"
                onClick={() => onRemove(line.variante.id)}
              >
                <Trash />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  aria-label="Restar cantidad"
                  onClick={() => onUpdateCantidad(line.variante.id, line.cantidad - 1)}
                  disabled={line.cantidad <= 1}
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center text-sm">{line.cantidad}</span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  aria-label="Sumar cantidad"
                  onClick={() => onUpdateCantidad(line.variante.id, line.cantidad + 1)}
                  disabled={line.cantidad >= line.variante.stock}
                >
                  <Plus />
                </Button>
              </div>
              <Input
                key={line.variante.id}
                type="number"
                className="h-8 w-20"
                defaultValue={line.descuento}
                aria-label="Descuento"
                onChange={(e) => onUpdateDescuento(line.variante.id, Number(e.target.value) || 0)}
              />
              <span className="w-16 text-right text-sm font-medium">
                {formatMoneda(line.cantidad * line.variante.precioVenta - line.descuento)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatMoneda(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Descuento</span>
          <span>{formatMoneda(descuentoTotal)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatMoneda(total)}</span>
        </div>
      </div>

      <Button
        type="button"
        disabled={cart.length === 0 || clienteId < 1 || isSubmitting}
        onClick={onSubmit}
      >
        Registrar venta
      </Button>

      <Dialog open={clienteDialogOpen} onOpenChange={setClienteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <FormCliente
            onSuccess={(nuevoCliente) => {
              onClienteChange(nuevoCliente.id)
              setClienteDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarritoPanel
