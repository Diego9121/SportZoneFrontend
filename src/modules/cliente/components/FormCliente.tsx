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
import type { Cliente } from '../schemas/cliente.schema'
import { useCreateCliente, useUpdateCliente } from '../hooks/use-cliente'

const ClienteFormSchema = v.object({
  tipoDocumento: v.pipe(
    v.string(),
    v.minLength(1, 'El tipo de documento es obligatorio.'),
    v.maxLength(20, 'El tipo de documento no puede superar los 20 caracteres.'),
  ),
  documento: v.pipe(
    v.string(),
    v.minLength(1, 'El documento es obligatorio.'),
    v.maxLength(30, 'El documento no puede superar los 30 caracteres.'),
  ),
  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio.'),
    v.maxLength(100, 'El nombre no puede superar los 100 caracteres.'),
  ),
  telefono: v.optional(v.string(), ''),
  email: v.optional(v.string(), ''),
  direccion: v.optional(v.string(), ''),
})

interface FormClienteProps {
  cliente?: Cliente
  onSuccess?: (cliente: Cliente) => void
}

function FormCliente({ cliente, onSuccess }: FormClienteProps) {
  const isEditing = cliente !== undefined

  const form = useForm({
    schema: ClienteFormSchema,
    initialInput: {
      tipoDocumento: cliente?.tipoDocumento ?? '',
      documento: cliente?.documento ?? '',
      nombre: cliente?.nombre ?? '',
      telefono: cliente?.telefono ?? '',
      email: cliente?.email ?? '',
      direccion: cliente?.direccion ?? '',
    },
  })

  const createCliente = useCreateCliente()
  const updateCliente = useUpdateCliente()
  const isSubmitting = createCliente.isPending || updateCliente.isPending

  const handleSubmit: SubmitHandler<typeof ClienteFormSchema> = (output) => {
    const promise = isEditing
      ? updateCliente.mutateAsync({ id: cliente.id, payload: output })
      : createCliente.mutateAsync(output)

    promise
      .then((response) => {
        toast.success(
          isEditing
            ? 'Cliente actualizado correctamente.'
            : 'Cliente creado correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.(response.data)
      })
      .catch(() => {
        toast.error('No se pudo guardar el cliente.')
      })
  }

  return (
    <Form of={form} id="form-cliente" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FormischField of={form} path={['tipoDocumento']}>
            {(field) => (
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="cliente-tipo-documento">Tipo de documento</FieldLabel>
                <Input
                  {...field.props}
                  id="cliente-tipo-documento"
                  value={field.input ?? ''}
                  aria-invalid={field.errors !== null}
                  placeholder="Ej. CI, NIT, Pasaporte"
                />
                {field.errors && (
                  <FieldError
                    errors={field.errors.map((message) => ({ message }))}
                  />
                )}
              </Field>
            )}
          </FormischField>

          <FormischField of={form} path={['documento']}>
            {(field) => (
              <Field data-invalid={field.errors !== null}>
                <FieldLabel htmlFor="cliente-documento">N° de documento</FieldLabel>
                <Input
                  {...field.props}
                  id="cliente-documento"
                  value={field.input ?? ''}
                  aria-invalid={field.errors !== null}
                  placeholder="Ej. 89876543"
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

        <FormischField of={form} path={['nombre']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="cliente-nombre">Nombre</FieldLabel>
              <Input
                {...field.props}
                id="cliente-nombre"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. Juan Pérez"
              />
              <FieldDescription>Nombre completo del cliente.</FieldDescription>
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
              <FieldLabel htmlFor="cliente-telefono">Teléfono</FieldLabel>
              <Input
                {...field.props}
                id="cliente-telefono"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. 7958282"
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
              <FieldLabel htmlFor="cliente-email">Email</FieldLabel>
              <Input
                {...field.props}
                id="cliente-email"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Email opcional"
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
              <FieldLabel htmlFor="cliente-direccion">Dirección</FieldLabel>
              <Input
                {...field.props}
                id="cliente-direccion"
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
          {isEditing ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
      </div>
    </Form>
  )
}

export default FormCliente
