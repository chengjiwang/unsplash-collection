import { getPhotoById } from '@/api/unsplash'
import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

export const usePhoto = (id: Ref<string>) =>
  useQuery({
    queryKey: computed(() => ['photo', id.value]),
    queryFn: () => getPhotoById(id.value).then((r) => r.data),
  })
