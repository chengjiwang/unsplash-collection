<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-brand-surface px-4">
    <div class="w-full max-w-sm rounded-xl border border-brand-border p-8 shadow-sm">
      <h1 class="mb-6 text-center text-2xl font-bold text-brand-ink">{{ title }}</h1>

      <slot />

      <p v-if="$slots.footer" class="mt-6 text-center text-sm text-brand-muted">
        <slot name="footer" />
      </p>
    </div>
  </div>
</template>
