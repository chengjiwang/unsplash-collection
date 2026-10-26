<script setup lang="ts">
import ErrorState from '@/components/common/ErrorState.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <ErrorState title="Page not found" message="The page you're looking for doesn't exist.">
      <Button as-child variant="outline">
        <RouterLink to="/">Back to Home</RouterLink>
      </Button>
    </ErrorState>
  </div>
</template>
