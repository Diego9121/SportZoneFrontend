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
import type { Marca } from '../schemas/marca.schema'
import { useCreateMarca, useUpdateMarca } from '../hooks/use-marca'


const MarcaFormSchema = v.object({
  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio.'),
    v.maxLength(100, 'El nombre no puede superar los 100 caracteres.'),
  ),
  descripcion: v.optional(v.string(), ''),
  logo: v.optional(v.string(), ''),
})

interface FormMarcaProps {
  marca?: Marca
  onSuccess?: (marca: Marca) => void
}

function FormMarca({ marca, onSuccess }: FormMarcaProps) {
  const isEditing = marca !== undefined

  const form = useForm({
    schema: MarcaFormSchema,
    initialInput: {
      nombre: marca?.nombre ?? '',
      descripcion: marca?.descripcion ?? '',
      logo: marca?.logo ?? '',
    },
  })

  const createMarca = useCreateMarca()
  const updateMarca = useUpdateMarca()
  const isSubmitting = createMarca.isPending || updateMarca.isPending

  const handleSubmit: SubmitHandler<typeof MarcaFormSchema> = (output) => {
    const promise = isEditing
      ? updateMarca.mutateAsync({ id: marca.id, payload: output })
      : createMarca.mutateAsync(output)

    promise
      .then((response) => {
        toast.success(
          isEditing
            ? 'Marca actualizada correctamente.'
            : 'Marca creada correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.(response.data)
      })
      .catch(() => {
        toast.error('No se pudo guardar la marca.')
      })
  }

  return (
    <Form of={form} id="form-marca" onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={['nombre']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="marca-nombre">Nombre</FieldLabel>
              <Input
                {...field.props}
                id="marca-nombre"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. adidas, nike, etc."
              />
              <FieldDescription>Nombre visible de la marca.</FieldDescription>
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>
        <FormischField of={form} path={['logo']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="marca-logo">Logo</FieldLabel>
              <Input
                {...field.props}
                id="marca-logo"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. logo de la marca"
              />
              <FieldDescription>Logo de la marca.</FieldDescription>
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
              <FieldLabel htmlFor="marca-descripcion">Descripción</FieldLabel>
              <Input
                {...field.props}
                id="marca-descripcion"
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
          {isEditing ? 'Guardar cambios' : 'Crear marca'}
        </Button>
      </div>
    </Form>
  )
}

export default FormMarca
