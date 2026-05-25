<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateCollection } from '@/queries/mutations'
import { ref } from 'vue'

const showAddModal = defineModel<boolean>('open', { required: true })

const newCollectionName = ref('')

const { mutate: createCollection, isPending } = useCreateCollection()

function handleCreate() {
  if (!newCollectionName.value.trim()) return
  createCollection(newCollectionName.value.trim(), {
    onSuccess: () => {
      newCollectionName.value = ''
      showAddModal.value = false
    },
  })
}

function handleCancel() {
  showAddModal.value = false
}
</script>

<template>
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
            @click="handleCancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
