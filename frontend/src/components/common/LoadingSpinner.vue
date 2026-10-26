<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <div
    role="status"
    aria-label="Loading"
    class="animate-spin rounded-full border-2 border-brand-border border-t-brand-ink"
    :class="size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'"
  />
</template>
