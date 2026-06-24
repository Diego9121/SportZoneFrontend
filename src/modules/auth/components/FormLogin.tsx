import { Form, Field as FormischField, useForm } from '@formisch/react'
import type { SubmitHandler } from '@formisch/react'
import { useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import * as v from 'valibot'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useLogin } from '@/modules/auth/hooks/use-login'

const LoginFormSchema = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, 'El correo es obligatorio.'),
    v.email('Ingresa un correo válido.'),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(1, 'La contraseña es obligatoria.'),
  ),
})

function FormLogin() {
  const navigate = useNavigate()
  const { login: saveSession } = useAuth()
  const loginMutation = useLogin()

  const form = useForm({
    schema: LoginFormSchema,
    initialInput: { email: '', password: '' },
  })

  const handleSubmit: SubmitHandler<typeof LoginFormSchema> = (output) => {
    loginMutation.mutate(output, {
      onSuccess: (response) => {
        saveSession(response.data)
        toast.success(response.message || 'Login exitoso')
        navigate({ to: '/' })
      },
      onError: (error) => {
        const message = isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined
        toast.error(message ?? 'No se pudo iniciar sesión. Verifica tus credenciales.')
      },
    })
  }

  return (
    <Form of={form} id="form-login" onSubmit={handleSubmit}>
      <FieldGroup>
        <FormischField of={form} path={['email']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="login-email">Correo</FieldLabel>
              <Input
                {...field.props}
                id="login-email"
                type="email"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
              {field.errors && (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              )}
            </Field>
          )}
        </FormischField>

        <FormischField of={form} path={['password']}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
              <Input
                {...field.props}
                id="login-password"
                type="password"
                value={field.input ?? ''}
                aria-invalid={field.errors !== null}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {field.errors && (
                <FieldError errors={field.errors.map((message) => ({ message }))} />
              )}
            </Field>
          )}
        </FormischField>
      </FieldGroup>

      <Button type="submit" className="mt-6 w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>
    </Form>
  )
}

export default FormLogin
