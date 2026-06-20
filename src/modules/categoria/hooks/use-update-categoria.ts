import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategoria } from '@/modules/categoria/api/categoria.api'
import type { CategoriaPayload } from '@/modules/categoria/api/categoria.api'

export function useUpdateCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoriaPayload }) =>
      updateCategoria(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
