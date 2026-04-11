<script setup lang="ts">
import { useRemoveImage } from '@/queries/mutations'
import type { Collection } from '@/types'
import { Minus } from 'lucide-vue-next'

const props = defineProps<{
  photoId: string
  collections: Collection[]
}>()

const { mutate, isPending } = useRemoveImage()

function handleRemove(collectionId: string) {
  mutate({ collectionId, imageId: props.photoId })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-brand-ink">Collections</h2>

    <ul class="flex flex-col gap-1">
      <li
        v-for="collection in collections"
        :key="collection.id"
        class="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-hover"
      >
        <!-- Preview thumbnail -->
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

        <!-- Remove button (visible on hover) -->
        <button
          class="flex cursor-pointer items-center gap-1 text-xs text-brand-ink opacity-0 transition-opacity group-hover:opacity-100"
          :disabled="isPending"
          @click="handleRemove(collection.id)"
        >
          <Minus class="h-3.5 w-3.5" />
          Remove
        </button>
      </li>
    </ul>

    <p v-if="collections.length === 0" class="text-sm text-brand-muted">
      Not in any collection yet.
    </p>
  </div>
</template>
