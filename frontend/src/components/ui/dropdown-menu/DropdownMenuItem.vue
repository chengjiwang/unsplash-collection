<script setup lang="ts">
import { DropdownMenuItem, type DropdownMenuItemProps, type DropdownMenuItemEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends DropdownMenuItemProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const emits = defineEmits<DropdownMenuItemEmits>()

const { class: className, ...rest } = props
</script>

<template>
  <DropdownMenuItem
    v-bind="rest"
    :class="
      cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )
    "
    @select="emits('select', $event)"
  >
    <slot />
  </DropdownMenuItem>
</template>
