<script setup lang="ts">
import { formatPhotoCount } from '@/lib/format'
import type { Collection } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  collection: Collection
}>()

// 依預覽圖數量決定拼貼版面：1 張滿版、2 張對半、3 張為左大右二
const LAYOUTS: Record<number, { grid: string; tiles: string[] }> = {
  1: { grid: 'grid-cols-1 grid-rows-1', tiles: [] },
  2: { grid: 'grid-cols-2 grid-rows-1', tiles: [] },
  3: { grid: 'grid-cols-3 grid-rows-2', tiles: ['col-span-2 row-span-2'] },
}

const previewImages = computed(() => props.collection.preview_images.slice(0, 3))
const layout = computed(() => LAYOUTS[previewImages.value.length] ?? LAYOUTS[1]!)

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
      <div v-if="previewImages.length > 0" class="grid h-full gap-0.5" :class="layout.grid">
        <div
          v-for="(image, index) in previewImages"
          :key="index"
          class="overflow-hidden"
          :class="layout.tiles[index]"
        >
          <img
            :src="image.small_url"
            :alt="collection.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <!-- No images: placeholder -->
      <div v-else class="flex h-full w-full items-center justify-center bg-brand-border">
        <span class="text-sm text-brand-muted">No photos yet</span>
      </div>
    </div>

    <!-- Card info -->
    <div class="px-3 py-3">
      <p class="truncate font-medium text-brand-ink">{{ collection.name }}</p>
      <p class="text-sm text-brand-muted">
        {{ formatPhotoCount(collection.image_count) }}
      </p>
    </div>
  </div>
</template>
