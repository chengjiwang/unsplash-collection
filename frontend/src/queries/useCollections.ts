import { getCollection, getCollectionImages, getCollections } from '@/api/collections'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export const useCollections = (
  params?: Ref<
    | {
        image_id?: string
        name?: string
        exclude_image_id?: string
      }
    | undefined
  >,
  options: { enabled?: MaybeRefOrGetter<boolean>; keepPreviousData?: boolean } = {},
) =>
  useQuery({
    queryKey: computed(() => ['collections', params?.value]),
    queryFn: () => getCollections(params?.value).then((r) => r.data),
    enabled: computed(() => toValue(options.enabled ?? true)),
    // 篩選條件變動時保留上一筆結果，避免列表閃成空狀態
    placeholderData: options.keepPreviousData ? keepPreviousData : undefined,
  })

export const useCollection = (collectionId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ['collection', collectionId.value]),
    queryFn: () => getCollection(collectionId.value).then((r) => r.data),
    enabled: computed(() => !!collectionId.value),
  })

export const useCollectionImages = (collectionId: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ['collectionImages', collectionId.value]),
    queryFn: () => getCollectionImages(collectionId.value).then((r) => r.data),
    enabled: computed(() => !!collectionId.value),
  })
