<script setup lang="ts">
import Logo from '@/assets/images/Logo.svg'
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
      <!-- Brand -->
      <RouterLink to="/" class="flex items-center gap-2">
        <img :src="Logo" alt="UnsplashBox Logo" class="h-6 w-32" />
      </RouterLink>

      <!-- Nav links -->
      <div class="flex items-center gap-2">
        <RouterLink
          to="/"
          class="rounded-sm px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            $route.name === 'home'
              ? 'bg-brand-border text-brand-ink'
              : 'text-brand-muted hover:text-brand-ink'
          "
        >
          Home
        </RouterLink>
        <RouterLink
          to="/collections"
          class="rounded-sm px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            $route.name === 'collections'
              ? 'bg-brand-border text-brand-ink'
              : 'text-brand-muted hover:text-brand-ink'
          "
        >
          Collections
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
