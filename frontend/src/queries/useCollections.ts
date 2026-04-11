import { getCollectionImages, getCollections } from '@/api/collections'
import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

export const useCollections = (
  params?: Ref<
    | {
        image_id?: string
        name?: string
        exclude_image_id?: string
      }
    | undefined
  >,
) =>
  useQuery({
    queryKey: computed(() => ['collections', params?.value]),
    queryFn: () => getCollections(params?.value).then((r) => r.data),
  })

export const useCollectionImages = (collectionId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ['collectionImages', collectionId.value]),
    queryFn: () => getCollectionImages(collectionId.value).then((r) => r.data),
    enabled: computed(() => !!collectionId.value),
  })
