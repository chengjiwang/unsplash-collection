<script setup lang="ts">
import { downloadPhotoById } from '@/api/unsplash'
import type { UnsplashPhoto } from '@/types'
import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const props = defineProps<{
  photo: UnsplashPhoto
}>()

const emit = defineEmits<{
  addToCollection: []
}>()

const isDownloading = ref(false)

const formattedDate = computed(() => {
  return new Date(props.photo.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

async function handleDownload() {
  if (isDownloading.value) return
  isDownloading.value = true
  try {
    const response = await downloadPhotoById(props.photo.id)
    const url = URL.createObjectURL(response.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.photo.id}.jpg`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Author -->
    <div class="flex items-center gap-3">
      <img
        v-if="photo.user.profile_image?.small"
        :src="photo.user.profile_image.small"
        :alt="photo.user.name"
        class="h-10 w-10 rounded-full object-cover"
      />
      <div
        v-else
        class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-border text-sm font-semibold text-brand-ink"
      >
        {{ photo.user.name.charAt(0).toUpperCase() }}
      </div>
      <span class="text-sm font-semibold text-brand-ink">{{ photo.user.name }}</span>
    </div>

    <!-- Published date -->
    <p class="text-sm text-brand-muted">Published on {{ formattedDate }}</p>

    <!-- Action buttons -->
    <div class="flex items-center gap-3">
      <Button
        variant="secondary"
        class="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-brand-ink transition-colors bg-brand-border hover:bg-brand-hover"
        @click="emit('addToCollection')"
      >
        <Plus class="h-4 w-4" />
        Add to Collection
      </Button>

      <Button
        variant="secondary"
        class="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-brand-ink transition-colors bg-brand-border hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isDownloading"
        @click="handleDownload"
      >
        <Download class="h-4 w-4" />
        {{ isDownloading ? 'Downloading...' : 'Download' }}
      </Button>
    </div>
  </div>
</template>
