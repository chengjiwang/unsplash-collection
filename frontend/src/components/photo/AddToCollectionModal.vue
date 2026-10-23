<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAddImageToCollection } from '@/queries/mutations'
import { useCollections } from '@/queries/useCollections'
import type { Collection, UnsplashPhoto } from '@/types'
import { Plus, Search } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  photo: UnsplashPhoto
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const searchTerm = ref('')
const debouncedTerm = refDebounced(searchTerm, 300)

// 關窗時重置，下次開啟時 debounce 已穩定為空字串，不會多打一次請求
watch(
  () => props.open,
  (open) => {
    if (!open) searchTerm.value = ''
  },
)

const params = computed(() => ({
  name: debouncedTerm.value.trim() || undefined,
  exclude_image_id: props.photo.id,
}))

const { data, isFetching, isError, refetch } = useCollections(params, {
  enabled: () => props.open,
  keepPreviousData: true,
})

const collections = computed(() => data.value ?? [])
const matchCount = computed(() => collections.value.length)

const { mutate: addImage, isPending: isAdding, variables: addVariables } = useAddImageToCollection()

// 只有正在送出的那一筆顯示 Adding...（失敗後 variables 仍保留，需搭配 isPending 判斷）
const addingCollectionId = computed(() =>
  isAdding.value ? addVariables.value?.collection.id : undefined,
)

function addTo(collection: Collection) {
  addImage({ collection, photo: props.photo }, { onSuccess: () => emit('update:open', false) })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg p-0 gap-0" :show-close-button="true">
      <DialogHeader class="px-6 pt-6 pb-4">
        <DialogTitle class="text-lg font-semibold text-brand-ink"> Add to Collections </DialogTitle>
      </DialogHeader>

      <!-- Search input -->
      <div class="px-6 pb-3">
        <div class="relative">
          <Input
            v-model="searchTerm"
            type="text"
            placeholder="Search collections..."
            class="pr-9"
          />
          <Search
            class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
          />
        </div>
        <p class="mt-2 text-xs text-brand-muted">
          <template v-if="isFetching">Searching...</template>
          <template v-else-if="isError">
            Failed to load collections.
            <button type="button" class="underline hover:text-brand-ink" @click="refetch()">
              Retry
            </button>
          </template>
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
          <Button
            variant="ghost"
            size="sm"
            class="flex items-center gap-1 text-xs text-brand-muted opacity-0 transition-opacity group-hover:opacity-100 h-auto p-2"
            :class="{
              'opacity-100': addingCollectionId === collection.id,
            }"
            :disabled="addingCollectionId === collection.id"
            @click="addTo(collection)"
          >
            <Plus class="h-3.5 w-3.5" />
            <span class="text-brand-ink">{{
              addingCollectionId === collection.id ? 'Adding...' : 'Add to Collection'
            }}</span>
          </Button>
        </li>

        <!-- Empty state -->
        <li
          v-if="!isFetching && !isError && collections.length === 0"
          class="px-3 py-4 text-center text-sm text-brand-muted"
        >
          No collections found.
        </li>
      </ul>

      <div class="h-4" />
    </DialogContent>
  </Dialog>
</template>
