import { Form, Field as FormischField, reset, useForm } from '@formisch/react'
import type { SubmitHandler } from '@formisch/react'
import { toast } from 'sonner'
import * as v from 'valibot'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useCreateCategoria } from '@/modules/categoria/hooks/use-create-categoria'
import { useUpdateCategoria } from '@/modules/categoria/hooks/use-update-categoria'
import type { Categoria } from '@/modules/categoria/schemas/categoria.schema'

const CategoriaFormSchema = v.object({
  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio.'),
    v.maxLength(100, 'El nombre no puede superar los 100 caracteres.'),
  ),
  descripcion: v.optional(v.string(), ''),
})

interface FormCategoriaProps {
  categoria?: Categoria
  onSuccess?: () => void
}

function FormCategoria({ categoria, onSuccess }: FormCategoriaProps) {
  const isEditing = categoria !== undefined

  const form = useForm({
    schema: CategoriaFormSchema,
    initialInput: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    },
  })

  const createCategoria = useCreateCategoria()
  const updateCategoria = useUpdateCategoria()
  const isSubmitting = createCategoria.isPending || updateCategoria.isPending

  const handleSubmit: SubmitHandler<typeof CategoriaFormSchema> = (output) => {
    const promise = isEditing
      ? updateCategoria.mutateAsync({ id: categoria.id, payload: output })
      : createCategoria.mutateAsync(output)

    promise
      .then(() => {
        toast.success(
          isEditing
            ? 'Categoría actualizada correctamente.'
            : 'Categoría creada correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.()
      })
      .catch(() => {
        toast.error('No se pudo guardar la categoría.')
      })
  }

  return (
    <Form of={form} id="form-categoria" onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={['nombre']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="categoria-nombre">Nombre</FieldLabel>
              <Input
                {...field.props}
                id="categoria-nombre"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. Calzado Deportivo"
              />
              <FieldDescription>Nombre visible de la categoría.</FieldDescription>
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
              <FieldLabel htmlFor="categoria-descripcion">Descripción</FieldLabel>
              <Input
                {...field.props}
                id="categoria-descripcion"
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
          {isEditing ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </div>
    </Form>
  )
}

export default FormCategoria
