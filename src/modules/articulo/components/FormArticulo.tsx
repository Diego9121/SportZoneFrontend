import { useEffect, useState } from 'react'
import { Form, Field as FormischField, reset, useField, useForm } from '@formisch/react'
import type { SubmitHandler } from '@formisch/react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import * as v from 'valibot'

import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  onSuccess?: () => void
}

function FormArticulo({ articulo, onSuccess }: FormArticuloProps) {
  const isEditing = articulo !== undefined
  const [marcaDialogOpen, setMarcaDialogOpen] = useState(false)
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false)

  const { data: marcasData } = useMarcas(1, 100)
  const { data: categoriasData } = useCategorias(1, 100)
  const marcas = marcasData?.data.items ?? []
  const categorias = categoriasData?.data.items ?? []

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

  // Se aplican en un efecto (no directo en el callback de éxito del form anidado)
  // porque ese callback corre dentro del ciclo de mutación de React Query del
  // formulario hijo, y la actualización del campo se pierde si se llama ahí mismo.
  const [pendingCategoriaId, setPendingCategoriaId] = useState<number | null>(null)
  const [pendingMarcaId, setPendingMarcaId] = useState<number | null>(null)

  useEffect(() => {
    if (pendingCategoriaId === null) return
    categoriaField.onChange(pendingCategoriaId)
    setPendingCategoriaId(null)
  }, [pendingCategoriaId, categoriaField])

  useEffect(() => {
    if (pendingMarcaId === null) return
    marcaField.onChange(pendingMarcaId)
    setPendingMarcaId(null)
  }, [pendingMarcaId, marcaField])

  const createArticulo = useCreateArticulo()
  const updateArticulo = useUpdateArticulo()
  const isSubmitting = createArticulo.isPending || updateArticulo.isPending

  const handleSubmit: SubmitHandler<typeof ArticuloFormSchema> = (output) => {
    const promise = isEditing
      ? updateArticulo.mutateAsync({ id: articulo.id, payload: output })
      : createArticulo.mutateAsync(output)

    promise
      .then(() => {
        toast.success(
          isEditing
            ? 'Artículo actualizado correctamente.'
            : 'Artículo creado correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.()
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
            <Select
              value={categoriaField.input ? String(categoriaField.input) : ''}
              onValueChange={(value) => categoriaField.onChange(Number(value))}
            >
              <SelectTrigger
                id="articulo-categoria"
                className="flex-1"
                aria-invalid={categoriaField.errors !== null}
              >
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={String(categoria.id)}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={marcaField.input ? String(marcaField.input) : ''}
              onValueChange={(value) => marcaField.onChange(Number(value))}
            >
              <SelectTrigger
                id="articulo-marca"
                className="flex-1"
                aria-invalid={marcaField.errors !== null}
              >
                <SelectValue placeholder="Selecciona una marca" />
              </SelectTrigger>
              <SelectContent>
                {marcas.map((marca) => (
                  <SelectItem key={marca.id} value={String(marca.id)}>
                    {marca.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <FormischField of={form} path={['imagen']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="articulo-imagen">Imagen</FieldLabel>
              <Input
                {...field.props}
                id="articulo-imagen"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="URL de la imagen"
              />
              <FieldDescription>
                URL de la imagen del artículo (por el momento solo URL).
              </FieldDescription>
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

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
              setPendingCategoriaId(nuevaCategoria.id)
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
              setPendingMarcaId(nuevaMarca.id)
              setMarcaDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Form>
  )
}

export default FormArticulo
