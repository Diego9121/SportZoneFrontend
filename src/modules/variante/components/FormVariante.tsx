import { useMemo, useState } from 'react'
import { Form, Field as FormischField, reset, useField, useForm } from '@formisch/react'
import type { SubmitHandler } from '@formisch/react'
import { Plus } from 'lucide-react'
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
import FormArticulo from '@/modules/articulo/components/FormArticulo'
import { useArticulos } from '@/modules/articulo/hooks/use-articulo'
import type { VarianteCreatePayload, VarianteUpdatePayload } from '../api/variante.api'
import { useCreateVariante, useUpdateVariante } from '../hooks/use-variante'
import type { Variante } from '../schemas/variante.schema'

const VarianteFormSchema = v.object({
  articuloId: v.pipe(v.number(), v.minValue(1, 'Selecciona un artículo.')),
  tallaUs: v.pipe(v.string(), v.minLength(1, 'La talla US es obligatoria.')),
  tallaEu: v.pipe(v.string(), v.minLength(1, 'La talla EU es obligatoria.')),
  tallaUk: v.pipe(v.string(), v.minLength(1, 'La talla UK es obligatoria.')),
  tallaCm: v.pipe(v.string(), v.minLength(1, 'La talla en CM es obligatoria.')),
  color: v.pipe(v.string(), v.minLength(1, 'El color es obligatorio.')),
  codigoBarras: v.pipe(v.string(), v.minLength(1, 'El código de barras es obligatorio.')),
  stock: v.pipe(
    v.number(),
    v.finite('Ingresa un número válido.'),
    v.minValue(0, 'El stock no puede ser negativo.'),
  ),
  stockMinimo: v.pipe(
    v.number(),
    v.finite('Ingresa un número válido.'),
    v.minValue(0, 'El stock mínimo no puede ser negativo.'),
  ),
  precioVenta: v.pipe(
    v.number(),
    v.finite('Ingresa un número válido.'),
    v.minValue(0, 'El precio de venta no puede ser negativo.'),
  ),
  precioCosto: v.pipe(
    v.number(),
    v.finite('Ingresa un número válido.'),
    v.minValue(0, 'El precio de costo no puede ser negativo.'),
  ),
})

interface NumberFieldProps {
  id: string
  label: string
  description?: string
  resetKey?: number
  field: {
    input: number | undefined
    errors: [string, ...string[]] | null
    onChange: (value: number) => void
  }
}

function numberOrEmpty(value: number | undefined) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : ''
}

function NumberField({ id, label, description, resetKey, field }: NumberFieldProps) {
  return (
    <Field data-invalid={field.errors !== null}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {/*
        Input no controlado: si fuera `value={...}` controlado y convirtiéramos
        el texto a número en cada tecla, escribir un decimal (ej. "320.5") se
        rompe — al tipear el punto, Number("320.") redondea a 320 y el
        re-render borra el punto que se acaba de escribir. Con `defaultValue`
        el navegador es dueño del texto mientras se escribe; `key` fuerza un
        remount (releyendo el valor actual) cuando el form se resetea.
      */}
      <Input
        key={resetKey}
        id={id}
        type="number"
        defaultValue={numberOrEmpty(field.input)}
        onChange={(e) =>
          field.onChange(e.target.value === '' ? Number.NaN : Number(e.target.value))
        }
        aria-invalid={field.errors !== null}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </Field>
  )
}

interface FormVarianteProps {
  variante?: Variante
  onSuccess?: (variante: Variante) => void
}

function FormVariante({ variante, onSuccess }: FormVarianteProps) {
  const isEditing = variante !== undefined
  const [articuloDialogOpen, setArticuloDialogOpen] = useState(false)
  const [resetVersion, setResetVersion] = useState(0)

  const { data: articulosData } = useArticulos(1, 100)
  const articulos = useMemo(() => articulosData?.data.items ?? [], [articulosData])

  const form = useForm({
    schema: VarianteFormSchema,
    initialInput: {
      articuloId: variante?.articuloId ?? 0,
      tallaUs: variante?.tallaUs ?? '',
      tallaEu: variante?.tallaEu ?? '',
      tallaUk: variante?.tallaUk ?? '',
      tallaCm: variante?.tallaCm ?? '',
      color: variante?.color ?? '',
      codigoBarras: variante?.codigoBarras ?? '',
      stock: variante?.stock ?? 0,
      stockMinimo: variante?.stockMinimo ?? 0,
      precioVenta: variante?.precioVenta ?? 0,
      precioCosto: variante?.precioCosto ?? 0,
    },
  })

  const articuloField = useField(form, { path: ['articuloId'] })
  const stockField = useField(form, { path: ['stock'] })
  const stockMinimoField = useField(form, { path: ['stockMinimo'] })
  const precioVentaField = useField(form, { path: ['precioVenta'] })
  const precioCostoField = useField(form, { path: ['precioCosto'] })

  const articuloItems = useMemo(
    () =>
      articulos.map((articulo) => ({
        value: articulo.id,
        label: `${articulo.nombre} (${articulo.codigo})`,
      })),
    [articulos],
  )
  const selectedArticuloItem =
    articuloItems.find((item) => item.value === articuloField.input) ?? null

  const createVariante = useCreateVariante()
  const updateVariante = useUpdateVariante()
  const isSubmitting = createVariante.isPending || updateVariante.isPending

  const handleSubmit: SubmitHandler<typeof VarianteFormSchema> = (output) => {
    const promise = isEditing
      ? updateVariante.mutateAsync({
        id: variante.id,
        payload: {
          tallaUs: output.tallaUs,
          tallaEu: output.tallaEu,
          tallaUk: output.tallaUk,
          tallaCm: output.tallaCm,
          color: output.color,
          codigoBarras: output.codigoBarras,
          stockMinimo: output.stockMinimo,
          precioVenta: output.precioVenta,
          precioCosto: output.precioCosto,
        } satisfies VarianteUpdatePayload,
      })
      : createVariante.mutateAsync(output satisfies VarianteCreatePayload)

    promise
      .then((response) => {
        toast.success(
          isEditing
            ? 'Variante actualizada correctamente.'
            : 'Variante creada correctamente.',
        )
        if (!isEditing) {
          reset(form)
          setResetVersion((v) => v + 1)
        }
        onSuccess?.(response.data)
      })
      .catch(() => {
        toast.error('No se pudo guardar la variante.')
      })
  }

  return (
    <Form of={form} id="form-variante" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={articuloField.errors !== null}>
          <FieldLabel htmlFor="variante-articulo">Artículo</FieldLabel>
          <div className="flex gap-2">
            <Combobox
              items={articuloItems}
              value={selectedArticuloItem}
              onValueChange={(item) => articuloField.onChange(item ? item.value : 0)}
              isItemEqualToValue={(a, b) => a.value === b.value}
            >
              <ComboboxInput
                id="variante-articulo"
                className="flex-1"
                aria-invalid={articuloField.errors !== null}
                placeholder="Selecciona un artículo"
                disabled={isEditing}
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
              size="icon"
              variant="outline"
              aria-label="Nuevo Modelo"
              disabled={isEditing}
              onClick={() => setArticuloDialogOpen(true)}
            >
              <Plus />
            </Button>
          </div>
          {isEditing && (
            <FieldDescription>
              El artículo de una variante no se puede cambiar luego de creada.
            </FieldDescription>
          )}
          {articuloField.errors && (
            <FieldError
              errors={articuloField.errors.map((message) => ({ message }))}
            />
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <FormischField of={form} path={['tallaUs']}>
            {(field) => (
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="variante-talla-us">Talla US</FieldLabel>
                <Input
                  {...field.props}
                  id="variante-talla-us"
                  value={field.input ?? ''}
                  aria-invalid={field.errors !== null}
                  placeholder="Ej. 9"
                />
                {field.errors && (
                  <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                  />
                )}
              </Field>
            )}
          </FormischField>

          <FormischField of={form} path={['tallaEu']}>
            {(field) => (
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="variante-talla-eu">Talla EU</FieldLabel>
                <Input
                  {...field.props}
                  id="variante-talla-eu"
                  value={field.input ?? ''}
                  aria-invalid={field.errors !== null}
                  placeholder="Ej. 42.5"
                />
                {field.errors && (
                  <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                  />
                )}
              </Field>
            )}
          </FormischField>

          <FormischField of={form} path={['tallaUk']}>
            {(field) => (
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="variante-talla-uk">Talla UK</FieldLabel>
                <Input
                  {...field.props}
                  id="variante-talla-uk"
                  value={field.input ?? ''}
                  aria-invalid={field.errors !== null}
                  placeholder="Ej. 8"
                />
                {field.errors && (
                  <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                  />
                )}
              </Field>
            )}
          </FormischField>

          <FormischField of={form} path={['tallaCm']}>
            {(field) => (
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="variante-talla-cm">Talla CM</FieldLabel>
                <Input
                  {...field.props}
                  id="variante-talla-cm"
                  value={field.input ?? ''}
                  aria-invalid={field.errors !== null}
                  placeholder="Ej. 27.0"
                />
                {field.errors && (
                  <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                  />
                )}
              </Field>
            )}
          </FormischField>
        </div>

        <FormischField of={form} path={['color']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="variante-color">Color</FieldLabel>
              <Input
                {...field.props}
                id="variante-color"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. Negro/Blanco"
              />
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['codigoBarras']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="variante-codigo-barras">Código de barras</FieldLabel>
              <Input
                {...field.props}
                id="variante-codigo-barras"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. 7790000000001"
              />
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <div className="grid grid-cols-2 gap-4">
          {!isEditing && (
            <NumberField
              id="variante-stock"
              label="Stock inicial"
              resetKey={resetVersion}
              field={stockField}
            />
          )}
          <NumberField
            id="variante-stock-minimo"
            label="Stock mínimo"
            description="Por debajo de este valor se marca como stock bajo."
            resetKey={resetVersion}
            field={stockMinimoField}
          />
          <NumberField
            id="variante-precio-venta"
            label="Precio de venta Bs."
            resetKey={resetVersion}
            field={precioVentaField}
          />
          <NumberField
            id="variante-precio-costo"
            label="Precio de costo Bs."
            resetKey={resetVersion}
            field={precioCostoField}
          />
        </div>
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
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Guardar cambios' : 'Crear variante'}
        </Button>
      </div>

      <Dialog open={articuloDialogOpen} onOpenChange={setArticuloDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Modelo</DialogTitle>
          </DialogHeader>
          <FormArticulo
            onSuccess={(nuevoArticulo) => {
              articuloField.onChange(nuevoArticulo.id)
              setArticuloDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Form>
  )
}

export default FormVariante
