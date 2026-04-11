<script setup lang="ts">
import { useSearchPhotos } from '@/queries/useSearchPhotos'
import { useSearchStore } from '@/stores/searchStore'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchStore = useSearchStore()
const { keyword } = storeToRefs(searchStore)

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
  useSearchPhotos(keyword)

const photos = computed(() => data.value?.pages.flatMap((p) => p.results) ?? [])

const sentinel = ref<HTMLElement | null>(null)

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage()
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Initial loading -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div
        class="h-8 w-8 animate-spin rounded-full border-2 border-brand-gradient-to border-t-transparent"
      />
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="py-16 text-center text-brand-muted">
      Something went wrong. Please try again.
    </div>

    <!-- Empty state (searched but no results) -->
    <div v-else-if="photos.length === 0 && keyword" class="py-16 text-center text-brand-muted">
      No photos found for "{{ keyword }}".
    </div>

    <!-- Photo grid (CSS columns for masonry-like layout) -->
    <div v-else-if="photos.length > 0" class="columns-2 gap-4 md:columns-3 lg:columns-4">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02]"
        @click="router.push(`/photos/${photo.id}`)"
      >
        <img
          :src="photo.urls.thumb"
          :alt="photo.alt_description ?? photo.description ?? 'Unsplash photo'"
          class="w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Intersection sentinel for infinite scroll -->
    <div ref="sentinel" class="h-4" />

    <!-- Loading next page -->
    <div v-if="isFetchingNextPage" class="flex justify-center py-8">
      <div
        class="h-6 w-6 animate-spin rounded-full border-2 border-brand-gradient-to border-t-transparent"
      />
    </div>
  </div>
</template>
