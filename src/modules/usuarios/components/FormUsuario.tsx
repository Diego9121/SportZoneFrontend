import { useMemo, useState } from 'react'
import { Form, Field as FormischField, reset, useField, useForm } from '@formisch/react'
import type { SubmitHandler } from '@formisch/react'
import { toast } from 'sonner'
import * as v from 'valibot'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useRoles } from '@/modules/roles/hooks/use-rol'
import type { UsuarioCreatePayload, UsuarioUpdatePayload } from '../api/usuario.api'
import { useCreateUsuario, useUpdateUsuario } from '../hooks/use-usuario'
import type { Usuarios } from '../schemas/usuarioSchema'

const UsuarioFormSchema = v.object({
  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio.'),
    v.maxLength(150, 'El nombre no puede superar los 150 caracteres.'),
  ),
  email: v.pipe(
    v.string(),
    v.minLength(1, 'El correo es obligatorio.'),
    v.email('Ingresa un correo válido.'),
  ),
  password: v.optional(v.string(), ''),
  rolId: v.pipe(v.number(), v.minValue(1, 'Selecciona un rol.')),
  activo: v.boolean(),
})

interface FormUsuarioProps {
  usuario?: Usuarios
  onSuccess?: (usuario: Usuarios) => void
}

function FormUsuario({ usuario, onSuccess }: FormUsuarioProps) {
  const isEditing = usuario !== undefined
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const { data: rolesData } = useRoles(1, 100)
  const roles = useMemo(() => rolesData?.data.items ?? [], [rolesData])
  const rolItems = useMemo(
    () => roles.map((rol) => ({ value: rol.id, label: rol.nombre })),
    [roles],
  )

  const form = useForm({
    schema: UsuarioFormSchema,
    initialInput: {
      nombre: usuario?.nombre ?? '',
      email: usuario?.email ?? '',
      password: '',
      rolId: usuario?.rolId ?? 0,
      activo: usuario?.activo ?? true,
    },
  })

  const rolField = useField(form, { path: ['rolId'] })
  const activoField = useField(form, { path: ['activo'] })

  const createUsuario = useCreateUsuario()
  const updateUsuario = useUpdateUsuario()
  const isSubmitting = createUsuario.isPending || updateUsuario.isPending

  const handleSubmit: SubmitHandler<typeof UsuarioFormSchema> = (output) => {
    if (!isEditing && output.password.trim().length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setPasswordError(null)

    const promise = isEditing
      ? updateUsuario.mutateAsync({
        id: usuario.id,
        payload: {
          nombre: output.nombre,
          email: output.email,
          rolId: output.rolId,
          activo: output.activo,
        } satisfies UsuarioUpdatePayload,
      })
      : createUsuario.mutateAsync({
        nombre: output.nombre,
        email: output.email,
        password: output.password,
        rolId: output.rolId,
      } satisfies UsuarioCreatePayload)

    promise
      .then((response) => {
        toast.success(
          isEditing
            ? 'Usuario actualizado correctamente.'
            : 'Usuario creado correctamente.',
        )
        if (!isEditing) reset(form)
        onSuccess?.(response.data)
      })
      .catch(() => {
        toast.error('No se pudo guardar el usuario.')
      })
  }

  return (
    <Form of={form} id="form-usuario" onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={['nombre']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="usuario-nombre">Nombre</FieldLabel>
              <Input
                {...field.props}
                id="usuario-nombre"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. Juan Pérez"
              />
              {field.errors && (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['email']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="usuario-email">Correo</FieldLabel>
              <Input
                {...field.props}
                id="usuario-email"
                type="email"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="Ej. juan@sportzone.com"
              />
              {field.errors && (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              )}
            </Field>
          )}
        </FormischField>

        {!isEditing && (
          <FormischField of={form} path={['password']}>
            {(field) => (
              <Field data-invalid={passwordError !== null}>
                <FieldLabel htmlFor="usuario-password">Contraseña</FieldLabel>
                <Input
                  {...field.props}
                  id="usuario-password"
                  type="password"
                  value={field.input ?? ''}
                  aria-invalid={passwordError !== null}
                  placeholder="Mínimo 6 caracteres"
                />
                {passwordError && <FieldError errors={[{ message: passwordError }]} />}
              </Field>
            )}
          </FormischField>
        )}

        <Field data-invalid={rolField.errors !== null}>
          <FieldLabel htmlFor="usuario-rol">Rol</FieldLabel>
          <Select
            value={rolField.input ? rolField.input.toString() : undefined}
            onValueChange={(value) => rolField.onChange(Number(value))}
          >
            <SelectTrigger
              id="usuario-rol"
              className="w-full"
              aria-invalid={rolField.errors !== null}
            >
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                {rolItems.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {rolField.errors && (
            <FieldError errors={rolField.errors.map((message) => ({ message }))} />
          )}
        </Field>

        {isEditing && (
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="usuario-activo">Usuario activo</FieldLabel>
              <FieldDescription>
                Si lo desactivas, no podrá iniciar sesión.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="usuario-activo"
              checked={activoField.input}
              onCheckedChange={(checked) => activoField.onChange(checked)}
            />
          </Field>
        )}
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => reset(form)}>
          Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </Form>
  )
}

export default FormUsuario
