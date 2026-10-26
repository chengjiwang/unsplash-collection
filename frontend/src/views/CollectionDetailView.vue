<script setup lang="ts">
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CollectionImageGrid from '@/components/collections/CollectionImageGrid.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/apiError'
import { formatPhotoCount } from '@/lib/format'
import { useCollection, useCollectionImages } from '@/queries/useCollections'
import axios from 'axios'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const collectionId = computed(() => String(route.params['id'] ?? ''))

const {
  data: selectedCollection,
  isLoading: collectionLoading,
  error: collectionError,
  refetch: refetchCollection,
} = useCollection(collectionId)

const {
  data: images,
  isLoading: imagesLoading,
  error: imagesError,
  refetch: refetchImages,
} = useCollectionImages(collectionId)

const isLoading = computed(() => collectionLoading.value || imagesLoading.value)

const error = computed(() => collectionError.value ?? imagesError.value)

// Backend returns 404 both for a missing collection and one owned by another user
const isNotFound = computed(
  () => axios.isAxiosError(error.value) && error.value.response?.status === 404,
)

function retry() {
  refetchCollection()
  refetchImages()
}

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
    </div>
    <div v-if="isLoading" class="flex justify-center pt-20">
      <LoadingSpinner />
    </div>
    <ErrorState
      v-else-if="isNotFound"
      title="Collection not found"
      message="This collection doesn't exist or you don't have access to it."
    />
    <ErrorState
      v-else-if="error"
      title="Couldn't load this collection"
      :message="getApiErrorMessage(error, 'Something went wrong. Please try again.')"
    >
      <Button variant="outline" @click="retry">Try again</Button>
    </ErrorState>
    <div v-else>
      <div v-if="selectedCollection" class="mb-8 text-center">
        <PageTitle>{{ selectedCollection.name }}</PageTitle>
        <p class="mt-2 text-brand-muted">
          {{ formatPhotoCount(selectedCollection.image_count) }}
        </p>
      </div>

      <CollectionImageGrid v-if="images && images.length > 0" :images="images" />
      <p v-else class="pt-20 text-center text-sm text-brand-muted">
        No photos in this collection yet.
      </p>
    </div>
  </div>
</template>
