import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategoria } from '@/modules/categoria/api/categoria.api'

export function useDeleteCategoria() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })
}
