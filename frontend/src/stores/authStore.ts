import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('user') ?? 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))

  const isLoggedIn = computed(() => user.value !== null)

  function setAuth(newUser: AuthUser, newToken: string) {
    user.value = newUser
    token.value = newToken
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('token', newToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, setAuth, logout }
})
