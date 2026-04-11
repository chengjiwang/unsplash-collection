<script setup lang="ts">
import type { Collection } from '@/types'

defineProps<{
  collection: Collection
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="group cursor-pointer overflow-hidden bg-brand-surface transition-all duration-200 hover:-translate-y-0.5"
    @click="$emit('click')"
  >
    <!-- Preview images mosaic -->
    <div class="relative h-48 w-full overflow-hidden bg-brand-border rounded-md">
      <!-- 3+ images: large left + 2 stacked right -->
      <template v-if="collection.preview_images.length >= 3">
        <div class="flex h-full gap-0.5">
          <div class="h-full w-2/3 overflow-hidden">
            <img
              :src="collection.preview_images[0]?.thumb_url"
              :alt="collection.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="flex h-full w-1/3 flex-col gap-0.5">
            <div class="h-1/2 overflow-hidden">
              <img
                :src="collection.preview_images[1]?.thumb_url"
                :alt="collection.name"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="h-1/2 overflow-hidden">
              <img
                :src="collection.preview_images[2]?.thumb_url"
                :alt="collection.name"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- 2 images: equal halves -->
      <template v-else-if="collection.preview_images.length === 2">
        <div class="flex h-full gap-0.5">
          <div class="h-full w-1/2 overflow-hidden">
            <img
              :src="collection.preview_images[0]?.thumb_url"
              :alt="collection.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="h-full w-1/2 overflow-hidden">
            <img
              :src="collection.preview_images[1]?.thumb_url"
              :alt="collection.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </template>

      <!-- 1 image: full width -->
      <template v-else-if="collection.preview_images.length === 1">
        <img
          :src="collection.preview_images[0]?.thumb_url"
          :alt="collection.name"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </template>

      <!-- No images: placeholder -->
      <template v-else>
        <div class="flex h-full w-full items-center justify-center bg-brand-border">
          <span class="text-sm text-brand-muted">No photos yet</span>
        </div>
      </template>
    </div>

    <!-- Card info -->
    <div class="px-3 py-3">
      <p class="truncate font-medium text-brand-ink">{{ collection.name }}</p>
      <p class="text-sm text-brand-muted">
        {{ collection.image_count }} {{ collection.image_count === 1 ? 'photo' : 'photos' }}
      </p>
    </div>
  </div>
</template>
