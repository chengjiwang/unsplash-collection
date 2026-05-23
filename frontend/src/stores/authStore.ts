import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('user') ?? 'null'))

  const isLoggedIn = computed(() => user.value !== null)

  function setAuth(newUser: AuthUser) {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, isLoggedIn, setAuth, logout }
})
