<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-vue-next'
import { ref } from 'vue'

const searchStore = useSearchStore()
const inputValue = ref(searchStore.keyword)

function onSearch() {
  if (inputValue.value.trim()) {
    searchStore.keyword = inputValue.value.trim()
  }
}
</script>

<template>
  <div class="relative w-full">
    <input
      v-model="inputValue"
      type="text"
      placeholder="Enter your keywords..."
      class="w-full rounded-md border border-brand-border bg-white px-5 py-3 pr-12 text-sm text-brand-ink shadow-sm placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-border"
      @keyup.enter="onSearch"
    />
    <Button
      variant="ghost"
      size="icon"
      class="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-muted transition-colors hover:text-brand-ink"
      @click="onSearch"
    >
      <Search :size="16" />
    </Button>
  </div>
</template>
