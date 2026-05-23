<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRegister } from '@/queries/useAuth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const validationError = computed(() => {
  if (password.value.length > 0 && password.value.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (confirmPassword.value.length > 0 && password.value !== confirmPassword.value) {
    return 'Passwords do not match'
  }
  return null
})

const { mutate: register, isPending, isError, error } = useRegister()

function handleSubmit() {
  if (validationError.value || !email.value || !password.value) return
  register({ email: email.value, password: password.value })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-brand-surface px-4">
    <div class="w-full max-w-sm rounded-xl border border-brand-border p-8 shadow-sm">
      <h1 class="mb-6 text-center text-2xl font-bold text-brand-ink">Register</h1>

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
            autocomplete="new-password"
            required
            placeholder="Min. 8 characters"
            class="rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-muted focus:border-brand-ink"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-brand-ink" for="confirm-password">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            placeholder="Repeat your password"
            class="rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-muted focus:border-brand-ink"
          />
        </div>

        <p v-if="validationError" class="text-sm text-red-500">{{ validationError }}</p>
        <p v-else-if="isError" class="text-sm text-red-500">
          {{ (error as any)?.response?.data?.message ?? 'Registration failed' }}
        </p>

        <button
          type="submit"
          :disabled="isPending || !!validationError"
          class="mt-2 rounded-lg bg-brand-ink py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {{ isPending ? 'Registering…' : 'Register' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-brand-muted">
        Already have an account?
        <RouterLink to="/login" class="font-medium text-brand-ink hover:underline">
          Login
        </RouterLink>
      </p>
    </div>
  </div>
</template>
