<script setup lang="ts">
import type { Collection } from '@/types'

defineProps<{
  collection: Collection
}>()
</script>

<template>
  <li
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

    <!-- 動作按鈕（父層需自行加上 hover 顯示樣式，li 已帶 group） -->
    <slot name="action" />
  </li>
</template>
