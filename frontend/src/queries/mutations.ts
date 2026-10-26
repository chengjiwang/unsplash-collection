import {
  addImageToCollection,
  createCollection,
  removeImageFromCollection,
} from '@/api/collections'
import type { Collection, UnsplashPhoto } from '@/types'
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
    onSuccess: (_data, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collection', collectionId] })
      queryClient.invalidateQueries({ queryKey: ['collectionImages', collectionId] })
      toast.success('Removed from collection')
    },
    onError: () => {
      toast.error('Failed to remove. Please try again.')
    },
  })
}

export const useAddImageToCollection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ collection, photo }: { collection: Collection; photo: UnsplashPhoto }) =>
      addImageToCollection(collection.id, {
        image_id: photo.id,
        image_url: photo.urls.regular,
        thumb_url: photo.urls.thumb,
        small_url: photo.urls.small,
        author_name: photo.user.name,
        published_at: photo.created_at,
      }),
    onSuccess: (_data, { collection }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collection', collection.id] })
      queryClient.invalidateQueries({ queryKey: ['collectionImages', collection.id] })
      toast.success(`Added to "${collection.name}"`)
    },
    onError: () => {
      toast.error('Failed to add. Please try again.')
    },
  })
}
