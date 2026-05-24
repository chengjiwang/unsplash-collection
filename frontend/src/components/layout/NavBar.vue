<script setup lang="ts">
import Logo from '@/assets/images/Logo.svg'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/queries/useAuth'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const authStore = useAuthStore()
const logoutMutation = useLogout()

function handleLogout() {
  logoutMutation.mutate()
}
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
      <!-- Brand -->
      <RouterLink to="/" class="flex items-center gap-2">
        <img :src="Logo" alt="UnsplashBox Logo" class="h-6 w-32" />
      </RouterLink>

      <!-- Nav links -->
      <div class="flex items-center gap-2">
        <RouterLink
          to="/"
          class="rounded-sm px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            $route.name === 'home'
              ? 'bg-brand-border text-brand-ink'
              : 'text-brand-muted hover:text-brand-ink'
          "
        >
          Home
        </RouterLink>
        <RouterLink
          to="/collections"
          class="rounded-sm px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            $route.name === 'collections'
              ? 'bg-brand-border text-brand-ink'
              : 'text-brand-muted hover:text-brand-ink'
          "
        >
          Collections
        </RouterLink>

        <!-- Auth: 已登入 -->
        <template v-if="authStore.isLoggedIn">
          <DropdownMenu>
            <DropdownMenuTrigger
              class="cursor-pointer ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-ink text-sm font-medium text-white focus:outline-none"
            >
              {{ authStore.user?.email?.[0]?.toUpperCase() }}
            </DropdownMenuTrigger>

            <DropdownMenuContent :side-offset="8">
              <DropdownMenuLabel class="truncate">
                {{ authStore.user?.email }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @select="handleLogout"> Logout </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <!-- Auth: 未登入 -->
        <template v-else>
          <RouterLink
            to="/login"
            class="rounded-sm px-4 py-1.5 text-sm font-medium transition-colors"
            :class="
              $route.name === 'login'
                ? 'bg-brand-border text-brand-ink'
                : 'text-brand-muted hover:text-brand-ink'
            "
          >
            Login
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
