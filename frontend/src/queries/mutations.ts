import { createCollection, removeImageFromCollection } from '@/api/collections'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export const useCreateCollection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createCollection(name).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      toast.success('Collection created')
    },
    onError: () => {
      toast.error('Failed to create collection. Please try again.')
    },
  })
}

export const useRemoveImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ collectionId, imageId }: { collectionId: string; imageId: string }) =>
      removeImageFromCollection(collectionId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      toast.success('Removed from collection')
    },
    onError: () => {
      toast.error('Failed to remove. Please try again.')
    },
  })
}
