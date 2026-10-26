import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

// 只測 guard 行為，不需要載入真正的 view
vi.mock('@/views/HomeView.vue', () => ({ default: {} }))
vi.mock('@/views/PhotoView.vue', () => ({ default: {} }))
vi.mock('@/views/CollectionsView.vue', () => ({ default: {} }))
vi.mock('@/views/CollectionDetailView.vue', () => ({ default: {} }))
vi.mock('@/views/LoginView.vue', () => ({ default: {} }))
vi.mock('@/views/RegisterView.vue', () => ({ default: {} }))
vi.mock('@/views/NotFoundView.vue', () => ({ default: {} }))

import router from '@/router'

describe('router guard', () => {
  beforeEach(async () => {
    localStorage.clear()
    setActivePinia(createPinia())
    await router.push('/')
  })

  it('redirects guests from protected routes to login with redirect', async () => {
    await router.push('/collections/42')

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/collections/42')
  })

  it('lets logged-in users into protected routes', async () => {
    useAuthStore().setAuth({ id: 'u1', email: 'a@b.com' }, 'jwt')
    await router.push('/collections')

    expect(router.currentRoute.value.name).toBe('collections')
  })

  it('lets guests view public routes', async () => {
    await router.push('/photos/abc')

    expect(router.currentRoute.value.name).toBe('photo')
  })

  it('falls through to not-found for unknown paths', async () => {
    await router.push('/does/not/exist')

    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
