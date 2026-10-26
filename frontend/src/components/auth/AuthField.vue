<script setup lang="ts">
import { Input } from '@/components/ui/input'

// 其餘屬性（type、autocomplete、placeholder…）透傳給 Input，而非外層 div
defineOptions({ inheritAttrs: false })

defineProps<{
  id: string
  label: string
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-brand-ink" :for="id">{{ label }}</label>
    <Input :id="id" v-model="model" class="rounded-lg" v-bind="$attrs" />
  </div>
</template>
