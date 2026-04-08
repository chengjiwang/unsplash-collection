import { searchPhotos } from '@/api/unsplash'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

export const useSearchPhotos = (keyword: Ref<string>) => {
  return useInfiniteQuery({
    queryKey: ['photos', keyword.value],
    queryFn: ({ pageParam }) => searchPhotos(keyword.value, pageParam).then((r) => r.data),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.total_pages ? lastPageParam + 1 : undefined,
    initialPageParam: 1,
    enabled: computed(() => keyword.value.trim().length > 0),
  })
}
