<script setup lang="ts">
import heroLeft from '@/assets/images/hero-left.webp'
import heroRight from '@/assets/images/hero-right.webp'
import PhotoGrid from '@/components/search/PhotoGrid.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { useSearchStore } from '@/stores/searchStore'
import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()
const { keyword } = storeToRefs(searchStore)
</script>

<template>
  <!-- DEFAULT STATE: centered search with decorative hero side images -->
  <div
    v-if="!keyword"
    class="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden"
  >
    <!-- Decorative side images: CSS backgrounds so they aren't downloaded while hidden on mobile -->
    <div
      class="absolute left-0 top-0 hidden h-full bg-cover bg-right md:block md:w-55 xl:w-85"
      :style="{ backgroundImage: `url(${heroLeft})` }"
    />
    <div
      class="absolute right-0 top-0 hidden h-full bg-cover bg-left md:block md:w-55 xl:w-85"
      :style="{ backgroundImage: `url(${heroRight})` }"
    />

    <!-- Center search content -->
    <div class="relative z-10 w-sm md:w-lg px-4 flex flex-col items-center gap-5 text-center">
      <h1 class="text-4xl font-semibold tracking-tight text-brand-ink">Search</h1>
      <p class="text-sm text-brand-muted">Search high-resolution images from Unsplash</p>
      <div class="w-full max-w-sm md:max-w-lg">
        <SearchBar />
      </div>
    </div>
  </div>

  <!-- RESULT STATE: gradient banner + photo grid -->
  <div v-else>
    <!-- Gradient banner with search bar overlapping bottom edge -->
    <div class="relative h-20 w-full bg-brand-banner">
      <div class="absolute bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 translate-y-1/2 px-6">
        <SearchBar />
      </div>
    </div>

    <!-- Photo results -->
    <div class="mx-auto max-w-7xl px-6 py-8 pt-12">
      <PhotoGrid />
    </div>
  </div>
</template>
