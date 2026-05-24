<script setup lang="ts">
import { useRemoveImage } from '@/queries/mutations'
import type { Collection } from '@/types'
import { Button } from '@/components/ui/button'
import { Minus } from 'lucide-vue-next'

const props = defineProps<{
  photoId: string
  collections: Collection[]
  isLoading: boolean
}>()

const { mutate, isPending } = useRemoveImage()

function handleRemove(collectionId: string) {
  mutate({ collectionId, imageId: props.photoId })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-brand-ink">Collections</h2>

    <ul
      v-if="isLoading"
      class="flex flex-col gap-2"
      aria-busy="true"
      aria-label="Loading collections"
    >
      <li v-for="index in 3" :key="index" class="flex items-center gap-3 rounded-lg px-3 py-2.5">
        <div class="h-12 w-12 shrink-0 animate-pulse rounded-md bg-brand-border/70" />

        <div class="flex flex-1 flex-col gap-2">
          <div class="h-4 w-32 max-w-[70%] animate-pulse rounded bg-brand-border/70" />
          <div class="h-3 w-20 animate-pulse rounded bg-brand-border/50" />
        </div>

        <div class="h-4 w-14 animate-pulse rounded bg-brand-border/50" />
      </li>
    </ul>

    <ul v-else-if="collections.length > 0" class="flex flex-col gap-1">
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
        <Button
          variant="ghost"
          size="sm"
          class="flex items-center gap-1 text-xs text-brand-ink opacity-0 transition-opacity group-hover:opacity-100 h-auto p-2"
          :disabled="isPending"
          @click="handleRemove(collection.id)"
        >
          <Minus class="h-3.5 w-3.5" />
          Remove
        </Button>
      </li>
    </ul>

    <p v-else class="text-sm text-brand-muted">Not in any collection yet.</p>
  </div>
</template>
