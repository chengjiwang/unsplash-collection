<script setup lang="ts">
import CollectionImageGrid from '@/components/collections/CollectionImageGrid.vue'
import { Button } from '@/components/ui/button'
import { useCollection, useCollectionImages } from '@/queries/useCollections'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const collectionId = computed(() => String(route.params['id'] ?? ''))

const { data: selectedCollection } = useCollection(collectionId)

const { data: images, isLoading: imagesLoading } = useCollectionImages(collectionId)

function backToList() {
  router.push('/collections')
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <div class="mb-4">
      <Button
        variant="outline"
        class="text-sm text-brand-muted transition-colors hover:text-brand-ink"
        @click="backToList"
      >
        ← Back to Collections
      </Button>
      <div class="mb-8 text-center">
        <h1
          class="bg-linear-to-r from-brand-gradient-from to-brand-gradient-to bg-clip-text text-4xl font-bold text-transparent"
        >
          {{ selectedCollection?.name }}
        </h1>
        <p class="mt-2 text-brand-muted">
          {{
            selectedCollection?.image_count === 1
              ? '1 photo'
              : `${selectedCollection?.image_count} photos`
          }}
        </p>
      </div>
    </div>

    <div v-if="imagesLoading" class="flex justify-center pt-20">
      <div
        class="h-8 w-8 animate-spin rounded-full border-2 border-brand-border border-t-brand-ink"
      />
    </div>
    <CollectionImageGrid v-else-if="images && images.length > 0" :images="images" />
    <p v-else class="pt-20 text-center text-sm text-brand-muted">
      No photos in this collection yet.
    </p>
  </div>
</template>
