<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLogin } from '@/queries/useAuth'
import { Button } from '@/components/ui/button'

const email = ref('')
const password = ref('')
const { mutate: login, isPending, isError } = useLogin()

function handleSubmit() {
  if (!email.value || !password.value) return
  login({ email: email.value, password: password.value })
}

function handleGuestLogin() {
  email.value = 'guest@example.com'
  password.value = 'qS7WM5qyYa9x5jG'
  setTimeout(handleSubmit, 300)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-brand-surface px-4">
    <div class="w-full max-w-sm rounded-xl border border-brand-border p-8 shadow-sm">
      <h1 class="mb-6 text-center text-2xl font-bold text-brand-ink">Login</h1>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-brand-ink" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            placeholder="you@example.com"
            class="rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-muted focus:border-brand-ink"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-brand-ink" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            placeholder="enter your password"
            class="rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-muted focus:border-brand-ink"
          />
        </div>

        <p v-if="isError" class="text-sm text-red-500">Invalid credentials</p>

        <Button
          type="submit"
          :disabled="isPending"
          class="mt-2 rounded-lg bg-brand-ink py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {{ isPending ? 'Logging in…' : 'Login' }}
        </Button>

        <Button
          type="button"
          variant="outline"
          :disabled="isPending"
          class="rounded-lg border-brand-border py-2 text-sm font-semibold text-brand-ink transition-opacity hover:bg-brand-surface disabled:opacity-60"
          @click="handleGuestLogin"
        >
          Guest Login
        </Button>
      </form>

      <p class="mt-6 text-center text-sm text-brand-muted">
        Don't have an account?
        <RouterLink to="/register" class="font-medium text-brand-ink hover:underline">
          Register
        </RouterLink>
      </p>
    </div>
  </div>
</template>
