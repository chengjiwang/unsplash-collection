import { removeImageFromCollection } from '@/api/collections'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const useRemoveImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ collectionId, imageId }: { collectionId: string; imageId: string }) =>
      removeImageFromCollection(collectionId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
