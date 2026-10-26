import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const user = { id: 'u1', email: 'a@b.com' }

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts logged out with empty storage', () => {
    const store = useAuthStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })

  it('setAuth updates state and persists to localStorage', () => {
    const store = useAuthStore()
    store.setAuth(user, 'jwt')

    expect(store.isLoggedIn).toBe(true)
    expect(store.user).toEqual(user)
    expect(store.token).toBe('jwt')
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(user)
    expect(localStorage.getItem('token')).toBe('jwt')
  })

  it('restores state from localStorage', () => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', 'jwt')

    const store = useAuthStore()
    expect(store.isLoggedIn).toBe(true)
    expect(store.user).toEqual(user)
    expect(store.token).toBe('jwt')
  })

  it('logout clears state and localStorage', () => {
    const store = useAuthStore()
    store.setAuth(user, 'jwt')
    store.logout()

    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
