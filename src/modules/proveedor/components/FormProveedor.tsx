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
import type { Proveedor } from '../schemas/proveedor.schema'
import { useCreateProveedor, useUpdateProveedor } from '../hooks/use-proveedor'

const ProveedorFormSchema = v.object({
  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio.'),
    v.maxLength(100, 'El nombre no puede superar los 100 caracteres.'),
  ),
  contacto: v.optional(v.string(), ''),
  telefono: v.optional(v.string(), ''),
  email: v.optional(v.string(), ''),
  direccion: v.optional(v.string(), ''),
})

interface FormProveedorProps {
  proveedor?: Proveedor
  onSuccess?: (proveedor: Proveedor) => void
}

function FormProveedor({ proveedor, onSuccess }: FormProveedorProps) {
  const isEditing = proveedor !== undefined

  const form = useForm({
    schema: ProveedorFormSchema,
    initialInput: {
      nombre: proveedor?.nombre ?? '',
      contacto: proveedor?.contacto ?? '',
      telefono: proveedor?.telefono ?? '',
      email: proveedor?.email ?? '',
      direccion: proveedor?.direccion ?? '',
    },
  })

  const createProveedor = useCreateProveedor()
  const updateProveedor = useUpdateProveedor()
  const isSubmitting = createProveedor.isPending || updateProveedor.isPending

  const handleSubmit: SubmitHandler<typeof ProveedorFormSchema> = (output) => {
    const promise = isEditing
      ? updateProveedor.mutateAsync({ id: proveedor.id, payload: output })
      : createProveedor.mutateAsync(output)

    promise
      .then((response) => {
        toast.success(
          isEditing
            ? 'Proveedor actualizado correctamente.'
            : 'Proveedor creado correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.(response.data)
      })
      .catch(() => {
        toast.error('No se pudo guardar el proveedor.')
      })
  }

  return (
    <Form of={form} id="form-proveedor" onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={['nombre']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="proveedor-nombre">Nombre</FieldLabel>
              <Input
                {...field.props}
                id="proveedor-nombre"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. Distribuidora Deportiva S.A."
              />
              <FieldDescription>Nombre visible del proveedor.</FieldDescription>
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['contacto']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="proveedor-contacto">Contacto</FieldLabel>
              <Input
                {...field.props}
                id="proveedor-contacto"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Nombre de la persona de contacto"
              />
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['telefono']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="proveedor-telefono">Teléfono</FieldLabel>
              <Input
                {...field.props}
                id="proveedor-telefono"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. 22954959"
              />
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['email']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="proveedor-email">Email</FieldLabel>
              <Input
                {...field.props}
                id="proveedor-email"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. contacto@proveedor.com"
              />
              {field.errors && (
                <FieldError
                  errors={field.errors.map((message) => ({ message }))}
                />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['direccion']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="proveedor-direccion">Dirección</FieldLabel>
              <Input
                {...field.props}
                id="proveedor-direccion"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Dirección opcional"
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
          {isEditing ? 'Guardar cambios' : 'Crear proveedor'}
        </Button>
      </div>
    </Form>
  )
}

export default FormProveedor
