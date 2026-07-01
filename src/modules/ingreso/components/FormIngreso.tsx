import { useMemo, useState } from 'react'
import { formatMoneda } from '@/lib/currency'
import {
  Form,
  Field as FormischField,
  insert,
  remove,
  reset,
  useField,
  useFieldArray,
  useForm,
} from '@formisch/react'
import type { FormStore, SubmitHandler } from '@formisch/react'
import { Plus, Trash } from 'lucide-react'
import { toast } from 'sonner'
import * as v from 'valibot'

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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import FormProveedor from '@/modules/proveedor/components/FormProveedor'
import { useProveedores } from '@/modules/proveedor/hooks/use-proveedor'
import FormVariante from '@/modules/variante/components/FormVariante'
import { useAllVariantes } from '@/modules/variante/hooks/use-variante'
import { useCreateIngreso } from '../hooks/use-ingreso'

const IngresoDetalleFormSchema = v.object({
  varianteId: v.pipe(v.number(), v.minValue(1, 'Selecciona una variante.')),
  cantidad: v.pipe(
    v.number(),
    v.finite('Ingresa un número válido.'),
    v.minValue(1, 'La cantidad debe ser mayor a 0.'),
  ),
  precioCosto: v.pipe(
    v.number(),
    v.finite('Ingresa un número válido.'),
    v.minValue(0, 'El precio de costo no puede ser negativo.'),
  ),
})

const IngresoFormSchema = v.object({
  proveedorId: v.pipe(v.number(), v.minValue(1, 'Selecciona un proveedor.')),
  numeroDoc: v.pipe(v.string(), v.minLength(1, 'El número de documento es obligatorio.')),
  observacion: v.optional(v.string(), ''),
  detalles: v.pipe(
    v.array(IngresoDetalleFormSchema),
    v.minLength(1, 'Agrega al menos una línea de detalle.'),
  ),
})

type IngresoForm = FormStore<typeof IngresoFormSchema>
type VarianteItem = { value: number; label: string }

function numberOrEmpty(value: number | undefined) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : ''
}

interface DetalleRowProps {
  form: IngresoForm
  index: number
  varianteItems: VarianteItem[]
  varianteCostoPorId: Map<number, number>
  onRemove: () => void
  canRemove: boolean
  resetVersion: number
}

function DetalleRow({
  form,
  index,
  varianteItems,
  varianteCostoPorId,
  onRemove,
  canRemove,
  resetVersion,
}: DetalleRowProps) {
  const [varianteDialogOpen, setVarianteDialogOpen] = useState(false)

  const varianteField = useField(form, { path: ['detalles', index, 'varianteId'] })
  const cantidadField = useField(form, { path: ['detalles', index, 'cantidad'] })
  const precioCostoField = useField(form, { path: ['detalles', index, 'precioCosto'] })

  const selectedVarianteItem =
    varianteItems.find((item) => item.value === varianteField.input) ?? null

  const cantidad = typeof cantidadField.input === 'number' ? cantidadField.input : 0
  const precioCosto = typeof precioCostoField.input === 'number' ? precioCostoField.input : 0
  const subtotal = Number.isFinite(cantidad) && Number.isFinite(precioCosto) ? cantidad * precioCosto : 0

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <div className="flex gap-2">
          <Combobox
            items={varianteItems}
            value={selectedVarianteItem}
            onValueChange={(item) => {
              varianteField.onChange(item ? item.value : 0)
              if (item) {
                const costoActual = varianteCostoPorId.get(item.value)
                if (costoActual !== undefined) precioCostoField.onChange(costoActual)
              }
            }}
            isItemEqualToValue={(a, b) => a.value === b.value}
          >
            <ComboboxInput
              className="flex-1"
              aria-invalid={varianteField.errors !== null}
              placeholder="Selecciona una variante"
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
            size="icon"
            variant="outline"
            aria-label="Nueva variante"
            onClick={() => setVarianteDialogOpen(true)}
          >
            <Plus />
          </Button>
        </div>
        {varianteField.errors && (
          <FieldError errors={varianteField.errors.map((message) => ({ message }))} />
        )}
      </div>

      {/*
        Inputs no controlados (`defaultValue` + `key`): si fueran `value`
        controlado convirtiendo a número en cada tecla, escribir un decimal
        (ej. "320.5") se rompe — al tipear el punto, Number("320.") redondea
        a 320 y el re-render borra el punto recién escrito. `key` fuerza un
        remount (releyendo el valor actual) al resetear el form o, en
        precioCosto, al cambiar de variante (autocompletado de costo).
      */}
      <div className="sm:w-24">
        <Input
          key={resetVersion}
          type="number"
          placeholder="Cantidad"
          defaultValue={numberOrEmpty(cantidadField.input)}
          aria-invalid={cantidadField.errors !== null}
          onChange={(e) =>
            cantidadField.onChange(e.target.value === '' ? Number.NaN : Number(e.target.value))
          }
        />
        {cantidadField.errors && (
          <FieldError errors={cantidadField.errors.map((message) => ({ message }))} />
        )}
      </div>

      <div className="sm:w-32">
        <Input
          key={`${resetVersion}-${varianteField.input}`}
          type="number"
          placeholder="Precio costo"
          defaultValue={numberOrEmpty(precioCostoField.input)}
          aria-invalid={precioCostoField.errors !== null}
          onChange={(e) =>
            precioCostoField.onChange(e.target.value === '' ? Number.NaN : Number(e.target.value))
          }
        />
        {precioCostoField.errors && (
          <FieldError errors={precioCostoField.errors.map((message) => ({ message }))} />
        )}
      </div>

      <div className="flex h-9 items-center justify-end gap-2 text-sm font-medium sm:w-28">
        {formatMoneda(subtotal)}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Quitar línea"
        disabled={!canRemove}
        onClick={onRemove}
      >
        <Trash />
      </Button>

      <Dialog open={varianteDialogOpen} onOpenChange={setVarianteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Talla/Color</DialogTitle>
          </DialogHeader>
          <FormVariante
            onSuccess={(nuevaVariante) => {
              varianteField.onChange(nuevaVariante.id)
              precioCostoField.onChange(nuevaVariante.precioCosto)
              setVarianteDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface FormIngresoProps {
  onSuccess?: () => void
}

function FormIngreso({ onSuccess }: FormIngresoProps) {
  const [proveedorDialogOpen, setProveedorDialogOpen] = useState(false)
  const [resetVersion, setResetVersion] = useState(0)

  const { data: proveedoresData } = useProveedores(1, 100)
  const proveedores = useMemo(() => proveedoresData?.data.items ?? [], [proveedoresData])
  const proveedorItems = useMemo(
    () => proveedores.map((proveedor) => ({ value: proveedor.id, label: proveedor.nombre })),
    [proveedores],
  )

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
  const varianteCostoPorId = useMemo(
    () => new Map(variantes.map((variante) => [variante.id, variante.precioCosto])),
    [variantes],
  )

  const form = useForm({
    schema: IngresoFormSchema,
    initialInput: {
      proveedorId: 0,
      numeroDoc: '',
      observacion: '',
      detalles: [{ varianteId: 0, cantidad: 1, precioCosto: 0 }],
    },
  })

  const proveedorField = useField(form, { path: ['proveedorId'] })
  const detallesArray = useFieldArray(form, { path: ['detalles'] })

  const selectedProveedorItem =
    proveedorItems.find((item) => item.value === proveedorField.input) ?? null

  const createIngreso = useCreateIngreso()

  const handleSubmit: SubmitHandler<typeof IngresoFormSchema> = (output) => {
    createIngreso
      .mutateAsync({
        proveedorId: output.proveedorId,
        numeroDoc: output.numeroDoc,
        observacion: output.observacion.trim() === '' ? null : output.observacion,
        detalles: output.detalles,
      })
      .then(() => {
        toast.success('Ingreso registrado correctamente.')
        reset(form)
        setResetVersion((v) => v + 1)
        onSuccess?.()
      })
      .catch(() => {
        toast.error('No se pudo registrar el ingreso.')
      })
  }

  return (
    <Form of={form} id="form-ingreso" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={proveedorField.errors !== null}>
          <FieldLabel htmlFor="ingreso-proveedor">Proveedor</FieldLabel>
          <div className="flex gap-2">
            <Combobox
              items={proveedorItems}
              value={selectedProveedorItem}
              onValueChange={(item) => proveedorField.onChange(item ? item.value : 0)}
              isItemEqualToValue={(a, b) => a.value === b.value}
            >
              <ComboboxInput
                id="ingreso-proveedor"
                className="flex-1"
                aria-invalid={proveedorField.errors !== null}
                placeholder="Selecciona un proveedor"
              />
              <ComboboxContent>
                <ComboboxEmpty>No se encontraron proveedores.</ComboboxEmpty>
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
              aria-label="Nuevo proveedor"
              onClick={() => setProveedorDialogOpen(true)}
            >
              <Plus />
            </Button>
          </div>
          {proveedorField.errors && (
            <FieldError errors={proveedorField.errors.map((message) => ({ message }))} />
          )}
        </Field>

        <FormischField of={form} path={['numeroDoc']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="ingreso-numero-doc">N° de documento</FieldLabel>
              <Input
                {...field.props}
                id="ingreso-numero-doc"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. factura o nota de remisión"
              />
              {field.errors && (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['observacion']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="ingreso-observacion">Observación</FieldLabel>
              <Input
                {...field.props}
                id="ingreso-observacion"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Observación opcional"
              />
              {field.errors && (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              )}
            </Field>
          )}
        </FormischField>

        <Field data-invalid={detallesArray.errors !== null}>
          <FieldLabel>Detalle del ingreso</FieldLabel>
          <FieldDescription>
            Variante, cantidad recibida y precio de costo de esta compra.
          </FieldDescription>
          <div className="hidden gap-2 px-3 text-xs font-medium text-muted-foreground sm:flex">
            <div className="flex-1">Variante</div>
            <div className="w-24">Cantidad</div>
            <div className="w-32">Precio costo</div>
            <div className="w-28 text-right">Subtotal</div>
            <div className="w-9" />
          </div>
          <div className="flex flex-col gap-2">
            {detallesArray.items.map((itemId, index) => (
              <DetalleRow
                key={itemId}
                form={form}
                index={index}
                varianteItems={varianteItems}
                varianteCostoPorId={varianteCostoPorId}
                canRemove={detallesArray.items.length > 1}
                onRemove={() => remove(form, { path: ['detalles'], at: index })}
                resetVersion={resetVersion}
              />
            ))}
          </div>
          {detallesArray.errors && (
            <FieldError errors={detallesArray.errors.map((message) => ({ message }))} />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() =>
              insert(form, {
                path: ['detalles'],
                initialInput: { varianteId: 0, cantidad: 1, precioCosto: 0 },
              })
            }
          >
            <Plus />
            Agregar línea
          </Button>
        </Field>
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset(form)
            setResetVersion((v) => v + 1)
          }}
        >
          Limpiar
        </Button>
        <Button type="submit" disabled={createIngreso.isPending}>
          Registrar ingreso
        </Button>
      </div>

      <Dialog open={proveedorDialogOpen} onOpenChange={setProveedorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo proveedor</DialogTitle>
          </DialogHeader>
          <FormProveedor
            onSuccess={(nuevoProveedor) => {
              proveedorField.onChange(nuevoProveedor.id)
              setProveedorDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Form>
  )
}

export default FormIngreso
