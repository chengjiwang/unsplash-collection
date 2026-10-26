<script setup lang="ts">
import { computed } from 'vue'
import { useRemoveImage } from '@/queries/mutations'
import type { Collection } from '@/types'
import CollectionListItem from '@/components/collections/CollectionListItem.vue'
import { Button } from '@/components/ui/button'
import { Minus } from '@lucide/vue'

const props = defineProps<{
  photoId: string
  collections: Collection[]
  isLoading: boolean
}>()

const { mutate, isPending, variables } = useRemoveImage()

// 只停用正在移除的那一列（失敗後 variables 仍保留，需搭配 isPending 判斷）
const removingCollectionId = computed(() =>
  isPending.value ? variables.value?.collectionId : undefined,
)

function handleRemove(collectionId: string) {
  mutate({ collectionId, imageId: props.photoId })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-brand-ink">Collections</h2>

    <ul
      v-if="isLoading"
      class="flex flex-col gap-2"
      aria-busy="true"
      aria-label="Loading collections"
    >
      <li v-for="index in 3" :key="index" class="flex items-center gap-3 rounded-lg px-3 py-2.5">
        <div class="h-12 w-12 shrink-0 animate-pulse rounded-md bg-brand-border/70" />

        <div class="flex flex-1 flex-col gap-2">
          <div class="h-4 w-32 max-w-[70%] animate-pulse rounded bg-brand-border/70" />
          <div class="h-3 w-20 animate-pulse rounded bg-brand-border/50" />
        </div>

        <div class="h-4 w-14 animate-pulse rounded bg-brand-border/50" />
      </li>
    </ul>

    <ul v-else-if="collections.length > 0" class="flex flex-col gap-1">
      <CollectionListItem
        v-for="collection in collections"
        :key="collection.id"
        :collection="collection"
      >
        <!-- Remove button (visible on hover) -->
        <template #action>
          <Button
            variant="ghost"
            size="sm"
            class="flex items-center gap-1 text-xs text-brand-ink opacity-0 transition-opacity group-hover:opacity-100 h-auto p-2"
            :disabled="removingCollectionId === collection.id"
            @click="handleRemove(collection.id)"
          >
            <Minus class="h-3.5 w-3.5" />
            Remove
          </Button>
        </template>
      </CollectionListItem>
    </ul>

    <p v-else class="text-sm text-brand-muted">Not in any collection yet.</p>
  </div>
</template>
