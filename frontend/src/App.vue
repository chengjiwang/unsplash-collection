<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
  <div class="min-h-screen bg-white">
    <NavBar />
    <main>
      <RouterView />
    </main>
  </div>
  <VueQueryDevtools />
</template>
