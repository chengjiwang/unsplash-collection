<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRegister } from '@/queries/useAuth'
import { Button } from '@/components/ui/button'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthField from '@/components/auth/AuthField.vue'
import { getApiErrorMessage } from '@/lib/apiError'

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
  <AuthCard title="Register">
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
        autocomplete="new-password"
        required
        placeholder="Min. 8 characters"
      />

      <AuthField
        id="confirm-password"
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        autocomplete="new-password"
        required
        placeholder="Repeat your password"
      />

      <p v-if="validationError" class="text-sm text-red-500">{{ validationError }}</p>
      <p v-else-if="isError" class="text-sm text-red-500">
        {{ getApiErrorMessage(error, 'Registration failed') }}
      </p>

      <Button
        type="submit"
        :disabled="isPending || !!validationError"
        class="mt-2 rounded-lg bg-brand-ink py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {{ isPending ? 'Registering…' : 'Register' }}
      </Button>
    </form>

    <template #footer>
      Already have an account?
      <RouterLink to="/login" class="font-medium text-brand-ink hover:underline">
        Login
      </RouterLink>
    </template>
  </AuthCard>
</template>
