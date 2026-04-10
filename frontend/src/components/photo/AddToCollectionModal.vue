<script setup lang="ts">
import { addImageToCollection, getCollections } from '@/api/collections'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Collection, UnsplashPhoto } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Plus, Search } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  photo: UnsplashPhoto
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const queryClient = useQueryClient()
const searchTerm = ref('')
const collections = ref<Collection[]>([])
const isLoading = ref(false)

// Fetch collections with name filter and exclude_image_id
async function fetchCollections(term: string) {
  isLoading.value = true
  try {
    const res = await getCollections({
      name: term || undefined,
      exclude_image_id: props.photo.id,
    })
    collections.value = res.data
  } finally {
    isLoading.value = false
  }
}

// Trigger fetch when modal opens or search term changes
watch(
  () => props.open,
  (open) => {
    if (open) {
      searchTerm.value = ''
      fetchCollections('')
    }
  },
)

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchTerm, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchCollections(val), 300)
})

const matchCount = computed(() => collections.value.length)

const addMutation = useMutation({
  mutationFn: (collection: Collection) =>
    addImageToCollection(collection.id, {
      image_id: props.photo.id,
      image_url: props.photo.urls.regular,
      thumb_url: props.photo.urls.thumb,
      author_name: props.photo.user.name,
      published_at: props.photo.created_at,
    }),
  onSuccess: (_data, collection) => {
    queryClient.invalidateQueries({ queryKey: ['collections'] })
    toast.success(`Added to "${collection.name}"`)
    emit('update:open', false)
  },
  onError: () => {
    toast.error('Failed to add. Please try again.')
  },
})

const addingCollectionId = computed<string | undefined>(
  () => (addMutation.variables as unknown as Collection | undefined)?.id,
)
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg p-0 gap-0" :show-close-button="true">
      <DialogHeader class="px-6 pt-6 pb-4">
        <DialogTitle class="text-lg font-semibold text-brand-ink"> Add to Collections </DialogTitle>
      </DialogHeader>

      <!-- Search input -->
      <div class="px-6 pb-3">
        <div class="flex items-center gap-2 rounded-md border border-brand-border px-3 py-2">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search collections..."
            class="w-full bg-transparent text-sm text-brand-ink placeholder:text-brand-muted outline-none"
          />
          <Search class="h-4 w-4 shrink-0 text-brand-muted" />
        </div>
        <p class="mt-2 text-xs text-brand-muted">
          <template v-if="isLoading">Searching...</template>
          <template v-else>{{ matchCount }} matches</template>
        </p>
      </div>

      <!-- Collection list -->
      <ul class="max-h-72 overflow-y-auto px-3 pb-2">
        <li
          v-for="collection in collections"
          :key="collection.id"
          class="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-hover"
        >
          <!-- Thumbnail -->
          <div class="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-brand-border">
            <img
              v-if="collection.preview_images[0]"
              :src="collection.preview_images[0].thumb_url"
              :alt="collection.name"
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Name + count -->
          <div class="flex flex-1 flex-col">
            <span class="text-sm font-medium text-brand-ink">{{ collection.name }}</span>
            <span class="text-xs text-brand-muted">{{ collection.image_count }} photos</span>
          </div>

          <!-- Add button (visible on hover) -->
          <button
            class="flex cursor-pointer items-center gap-1 text-xs text-brand-muted opacity-0 transition-opacity group-hover:opacity-100"
            :class="{
              'opacity-100': addMutation.isPending && addingCollectionId === collection.id,
            }"
            :disabled="addMutation.isPending && addingCollectionId === collection.id"
            @click="addMutation.mutate(collection)"
          >
            <Plus class="h-3.5 w-3.5" />
            <span class="text-brand-ink">{{
              addMutation.isPending && addingCollectionId === collection.id
                ? 'Adding...'
                : 'Add to Collection'
            }}</span>
          </button>
        </li>

        <!-- Empty state -->
        <li
          v-if="!isLoading && collections.length === 0"
          class="px-3 py-4 text-center text-sm text-brand-muted"
        >
          No collections found.
        </li>
      </ul>

      <div class="h-4" />
    </DialogContent>
  </Dialog>
</template>
