<script setup lang="ts">
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CollectionCard from '@/components/collections/CollectionCard.vue'
import AddCollectionModal from '@/components/collections/AddCollectionModal.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/apiError'
import { useCollections } from '@/queries/useCollections'
import { Plus } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data: collections, isLoading, isError, error, refetch } = useCollections()

const showAddModal = ref(false)

function openCollection(id: string) {
  router.push({ name: 'collection-detail', params: { id } })
}

function openAddModal() {
  showAddModal.value = true
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <!-- Header -->
    <div class="mb-10 text-center">
      <h1
        class="bg-linear-to-r from-brand-gradient-from to-brand-gradient-to bg-clip-text text-4xl font-bold text-transparent"
      >
        Collections
      </h1>
      <p class="mt-3 text-brand-muted">
        Explore the world through collections of beautiful<br />
        photos free to use under the
        <a
          href="https://unsplash.com/license"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
          >Unsplash License</a
        >.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center pt-20">
      <LoadingSpinner />
    </div>

    <!-- Error -->
    <ErrorState
      v-else-if="isError"
      title="Couldn't load collections"
      :message="getApiErrorMessage(error, 'Something went wrong. Please try again.')"
    >
      <Button variant="outline" @click="refetch()">Try again</Button>
    </ErrorState>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CollectionCard
        v-for="collection in collections"
        :key="collection.id"
        :collection="collection"
        @click="openCollection(collection.id)"
      />

      <!-- Add new collection card -->
      <Button
        variant="ghost"
        class="flex min-h-52 flex-col items-center justify-center gap-2 rounded-xl bg-brand-border text-brand-muted transition-colors hover:bg-brand-hover hover:text-brand-ink h-auto"
        @click="openAddModal"
      >
        <Plus class="h-6 w-6" />
        <span class="font-medium">Add new collection</span>
      </Button>
    </div>

    <!-- Add Collection Modal -->
    <AddCollectionModal v-model:open="showAddModal" />
  </div>
</template>
