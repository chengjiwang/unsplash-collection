<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="min-h-screen bg-white">
    <NavBar />
    <main>
      <RouterView />
    </main>
  </div>
  <VueQueryDevtools />
  <Toaster position="bottom-right" rich-colors />
</template>
