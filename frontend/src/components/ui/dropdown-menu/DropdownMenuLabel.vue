<script setup lang="ts">
import { DropdownMenuLabel, type DropdownMenuLabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends DropdownMenuLabelProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const { class: className, ...rest } = props
</script>

<template>
  <DropdownMenuLabel
    v-bind="rest"
    :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)"
  >
    <slot />
  </DropdownMenuLabel>
</template>
