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
import ImageUploadField from '@/components/ImageUploadField'
import FormCategoria from '@/modules/categoria/components/FormCategoria'
import { useCategorias } from '@/modules/categoria/hooks/use-categorias'
import FormMarca from '@/modules/marca/components/FormMarca'
import { useMarcas } from '@/modules/marca/hooks/use-marca'
import type { Articulo } from '../schemas/articulo.schema'
import { useCreateArticulo, useUpdateArticulo } from '../hooks/use-articulo'

const ArticuloFormSchema = v.object({
  categoriaId: v.pipe(
    v.number(),
    v.minValue(1, 'Selecciona una categoría.'),
  ),
  marcaId: v.pipe(
    v.number(),
    v.minValue(1, 'Selecciona una marca.'),
  ),
  codigo: v.pipe(
    v.string(),
    v.minLength(1, 'El código es obligatorio.'),
    v.maxLength(30, 'El código no puede superar los 30 caracteres.'),
  ),
  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio.'),
    v.maxLength(150, 'El nombre no puede superar los 150 caracteres.'),
  ),
  descripcion: v.optional(v.string(), ''),
  imagen: v.optional(v.string(), ''),
})

interface FormArticuloProps {
  articulo?: Articulo
  onSuccess?: (articulo: Articulo) => void
}

function FormArticulo({ articulo, onSuccess }: FormArticuloProps) {
  const isEditing = articulo !== undefined
  const [marcaDialogOpen, setMarcaDialogOpen] = useState(false)
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false)

  const { data: marcasData } = useMarcas(1, 100)
  const { data: categoriasData } = useCategorias(1, 100)
  const marcas = useMemo(() => marcasData?.data.items ?? [], [marcasData])
  const categorias = useMemo(() => categoriasData?.data.items ?? [], [categoriasData])

  const form = useForm({
    schema: ArticuloFormSchema,
    initialInput: {
      categoriaId: articulo?.categoriaId ?? 0,
      marcaId: articulo?.marcaId ?? 0,
      codigo: articulo?.codigo ?? '',
      nombre: articulo?.nombre ?? '',
      descripcion: articulo?.descripcion ?? '',
      imagen: articulo?.imagen ?? '',
    },
  })

  const categoriaField = useField(form, { path: ['categoriaId'] })
  const marcaField = useField(form, { path: ['marcaId'] })
  const imagenField = useField(form, { path: ['imagen'] })

  const categoriaItems = useMemo(
    () => categorias.map((categoria) => ({ value: categoria.id, label: categoria.nombre })),
    [categorias],
  )
  const marcaItems = useMemo(
    () => marcas.map((marca) => ({ value: marca.id, label: marca.nombre })),
    [marcas],
  )
  const selectedCategoriaItem =
    categoriaItems.find((item) => item.value === categoriaField.input) ?? null
  const selectedMarcaItem =
    marcaItems.find((item) => item.value === marcaField.input) ?? null

  const createArticulo = useCreateArticulo()
  const updateArticulo = useUpdateArticulo()
  const isSubmitting = createArticulo.isPending || updateArticulo.isPending

  const handleSubmit: SubmitHandler<typeof ArticuloFormSchema> = (output) => {
    const promise = isEditing
      ? updateArticulo.mutateAsync({ id: articulo.id, payload: output })
      : createArticulo.mutateAsync(output)

    promise
      .then((response) => {
        toast.success(
          isEditing
            ? 'Artículo actualizado correctamente.'
            : 'Artículo creado correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.(response.data)
      })
      .catch(() => {
        toast.error('No se pudo guardar el artículo.')
      })
  }

  return (
    <Form of={form} id="form-articulo" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={categoriaField.errors !== null}>
          <FieldLabel htmlFor="articulo-categoria">Categoría</FieldLabel>
          <div className="flex gap-2">
            <Combobox
              items={categoriaItems}
              value={selectedCategoriaItem}
              onValueChange={(item) => categoriaField.onChange(item ? item.value : 0)}
              isItemEqualToValue={(a, b) => a.value === b.value}
            >
              <ComboboxInput
                id="articulo-categoria"
                className="flex-1"
                aria-invalid={categoriaField.errors !== null}
                placeholder="Selecciona una categoría"
              />
              <ComboboxContent>
                <ComboboxEmpty>No se encontraron categorías.</ComboboxEmpty>
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
              aria-label="Nueva categoría"
              onClick={() => setCategoriaDialogOpen(true)}
            >
              <Plus />
            </Button>
          </div>
          {categoriaField.errors && (
            <FieldError
              errors={categoriaField.errors.map((message) => ({ message }))}
            />
          )}
        </Field>

        <Field data-invalid={marcaField.errors !== null}>
          <FieldLabel htmlFor="articulo-marca">Marca</FieldLabel>
          <div className="flex gap-2">
            <Combobox
              items={marcaItems}
              value={selectedMarcaItem}
              onValueChange={(item) => marcaField.onChange(item ? item.value : 0)}
              isItemEqualToValue={(a, b) => a.value === b.value}
            >
              <ComboboxInput
                id="articulo-marca"
                className="flex-1"
                aria-invalid={marcaField.errors !== null}
                placeholder="Selecciona una marca"
              />
              <ComboboxContent>
                <ComboboxEmpty>No se encontraron marcas.</ComboboxEmpty>
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
              aria-label="Nueva marca"
              onClick={() => setMarcaDialogOpen(true)}
            >
              <Plus />
            </Button>
          </div>
          {marcaField.errors && (
            <FieldError
              errors={marcaField.errors.map((message) => ({ message }))}
            />
          )}
        </Field>

        <FormischField of={form} path={['codigo']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="articulo-codigo">Código</FieldLabel>
              <Input
                {...field.props}
                id="articulo-codigo"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. NIK-VAP16-CLB-IC"
              />
              <FieldDescription>Código único del artículo.</FieldDescription>
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['nombre']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="articulo-nombre">Nombre</FieldLabel>
              <Input
                {...field.props}
                id="articulo-nombre"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. Nike Vapor 16 Club IC"
              />
              <FieldDescription>Nombre visible del artículo.</FieldDescription>
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <Field data-invalid={imagenField.errors !== null}>
          <FieldLabel htmlFor="articulo-imagen">Imagen</FieldLabel>
          <ImageUploadField
            value={imagenField.input ?? ''}
            onChange={imagenField.onChange}
            carpeta="articulos"
          />
          <FieldDescription>
            Sube una foto desde la galería o tómala con la cámara.
          </FieldDescription>
          {imagenField.errors && (
            <FieldError
              errors={imagenField.errors.map((message) => ({ message }))}
            />
          )}
        </Field>

        <FormischField of={form} path={['descripcion']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="articulo-descripcion">Descripción</FieldLabel>
              <Input
                {...field.props}
                id="articulo-descripcion"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Descripción opcional"
              />
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => reset(form)}>
          Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Guardar cambios' : 'Crear artículo'}
        </Button>
      </div>

      <Dialog open={categoriaDialogOpen} onOpenChange={setCategoriaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva categoría</DialogTitle>
          </DialogHeader>
          <FormCategoria
            onSuccess={(nuevaCategoria) => {
              categoriaField.onChange(nuevaCategoria.id)
              setCategoriaDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={marcaDialogOpen} onOpenChange={setMarcaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva marca</DialogTitle>
          </DialogHeader>
          <FormMarca
            onSuccess={(nuevaMarca) => {
              marcaField.onChange(nuevaMarca.id)
              setMarcaDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Form>
  )
}

export default FormArticulo
