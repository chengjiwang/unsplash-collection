<script setup lang="ts">
import type { CollectionImage } from '@/types'
import { useRouter } from 'vue-router'

defineProps<{
  images: CollectionImage[]
}>()

const router = useRouter()
</script>

<template>
  <div class="columns-2 gap-4 sm:columns-3 lg:columns-4">
    <div
      v-for="image in images"
      :key="image.id"
      class="group mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl"
      @click="router.push(`/photos/${image.image_id}`)"
    >
      <img
        :src="image.thumb_url"
        :alt="image.author_name"
        class="w-full rounded-xl object-cover transition-opacity duration-200 group-hover:opacity-90"
      />
    </div>
  </div>
</template>
