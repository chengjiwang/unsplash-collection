<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useLogin } from '@/queries/useAuth'
import { Button } from '@/components/ui/button'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthField from '@/components/auth/AuthField.vue'
import { getApiErrorMessage } from '@/lib/apiError'

const email = ref('')
const password = ref('')
const { mutate: login, isPending, isError, error } = useLogin()

function handleSubmit() {
  if (!email.value || !password.value) return
  login({ email: email.value, password: password.value })
}

function handleGuestLogin() {
  email.value = 'guest@example.com'
  password.value = 'qS7WM5qyYa9x5jG'
  handleSubmit()
}
</script>

<template>
  <AuthCard title="Login">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <AuthField
        id="email"
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@example.com"
      />

      <AuthField
        id="password"
        v-model="password"
        label="Password"
        type="password"
        autocomplete="current-password"
        required
        placeholder="enter your password"
      />

      <p v-if="isError" class="text-sm text-red-500">
        {{ getApiErrorMessage(error, 'Login failed') }}
      </p>

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

    <template #footer>
      Don't have an account?
      <RouterLink to="/register" class="font-medium text-brand-ink hover:underline">
        Register
      </RouterLink>
    </template>
  </AuthCard>
</template>
