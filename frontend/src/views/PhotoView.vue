<script setup lang="ts">
import AddToCollectionModal from '@/components/photo/AddToCollectionModal.vue'
import PhotoCollectionList from '@/components/photo/PhotoCollectionList.vue'
import PhotoDetail from '@/components/photo/PhotoDetail.vue'
import { useCollections } from '@/queries/useCollections'
import { usePhoto } from '@/queries/usePhoto'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const photoId = computed(() => String(route.params['id']))
const modalOpen = ref(false)

const { data: photo, isLoading: photoLoading, isError } = usePhoto(photoId)

const collectionsParams = computed(() => ({ image_id: photoId.value }))
const { data: collections } = useCollections(collectionsParams)

function goBack() {
  router.back()
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <!-- Loading -->
    <div v-if="photoLoading" class="flex h-96 items-center justify-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-2 border-brand-border border-t-brand-ink"
      />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="flex h-96 flex-col items-center justify-center gap-4">
      <p class="text-sm text-brand-muted">Failed to load photo.</p>
      <button
        class="rounded-md border border-brand-border px-4 py-2 text-sm text-brand-ink hover:bg-brand-hover"
        @click="goBack"
      >
        Go back
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="photo" class="flex flex-col gap-8 xl:flex-row xl:gap-12">
      <!-- Left: large photo -->
      <div class="xl:shrink-0 xl:w-[45%]">
        <img
          :src="photo.urls.regular"
          :alt="photo.alt_description ?? photo.description ?? photo.user.name"
          class="w-full rounded-xl object-cover shadow-sm"
        />
      </div>

      <!-- Right: info panel -->
      <div class="flex flex-1 flex-col gap-6">
        <PhotoDetail :photo="photo" @add-to-collection="modalOpen = true" />

        <hr class="border-brand-border" />

        <PhotoCollectionList :photo-id="photoId" :collections="collections ?? []" />
      </div>
    </div>

    <!-- Add to Collection Modal -->
    <AddToCollectionModal v-if="photo" v-model:open="modalOpen" :photo="photo" />
  </div>
</template>
