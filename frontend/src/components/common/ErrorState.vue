<script setup lang="ts">
defineProps<{
  title: string
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center pt-20 text-center">
    <h2 class="text-xl font-semibold text-brand-ink">{{ title }}</h2>
    <p v-if="message" class="mt-2 text-sm text-brand-muted">{{ message }}</p>
    <div v-if="$slots.default" class="mt-6 flex gap-3">
      <slot />
    </div>
  </div>
</template>
