<script setup lang="ts">
import CollectionCard from '@/components/collections/CollectionCard.vue'
import CollectionImageGrid from '@/components/collections/CollectionImageGrid.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateCollection } from '@/queries/mutations'
import { useCollectionImages, useCollections } from '@/queries/useCollections'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const selectedId = computed(() => String(route.query['id'] ?? ''))

const { data: collections, isLoading } = useCollections()
const selectedCollection = computed(() => collections.value?.find((c) => c.id === selectedId.value))

const { data: images, isLoading: imagesLoading } = useCollectionImages(selectedId)

const showAddModal = ref(false)
const newCollectionName = ref('')

const { mutate: createCollection, isPending } = useCreateCollection()

function openCollection(id: string) {
  router.push({ path: '/collections', query: { id } })
}

function backToList() {
  router.push('/collections')
}

function handleCreate() {
  if (!newCollectionName.value.trim()) return
  createCollection(newCollectionName.value.trim(), {
    onSuccess: () => {
      newCollectionName.value = ''
      showAddModal.value = false
    },
  })
}

function openAddModal() {
  newCollectionName.value = ''
  showAddModal.value = true
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <!-- Collection Detail View -->
    <template v-if="selectedId && selectedCollection">
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
            {{ selectedCollection.name }}
          </h1>
          <p class="mt-2 text-brand-muted">
            {{
              selectedCollection.image_count === 1
                ? '1 photo'
                : `${selectedCollection.image_count} photos`
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
    </template>

    <!-- Collection List View -->
    <template v-else>
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
        <div
          class="h-8 w-8 animate-spin rounded-full border-2 border-brand-border border-t-brand-ink"
        />
      </div>

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
    </template>

    <!-- Add Collection Modal -->
    <Dialog v-model:open="showAddModal">
      <DialogContent class="max-w-md" :show-close-button="false">
        <DialogHeader>
          <DialogTitle class="text-center">Add Collection</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-4 pt-2">
          <input
            v-model="newCollectionName"
            type="text"
            placeholder="Collection name..."
            class="w-full rounded-md border border-brand-border px-3 py-2 text-sm text-brand-ink placeholder:text-brand-muted outline-none focus:border-brand-ink"
            @keyup.enter="handleCreate"
          />
          <div class="flex justify-center gap-3">
            <Button
              variant="secondary"
              class="rounded-md px-6 py-2 text-sm font-medium text-brand-ink transition-opacity hover:opacity-90 disabled:opacity-50"
              :disabled="isPending || !newCollectionName.trim()"
              @click="handleCreate"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              class="rounded-md cursor-pointer px-6 py-2 text-sm font-medium text-brand-ink hover:text-brand-muted"
              @click="showAddModal = false"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
