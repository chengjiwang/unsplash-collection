import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'

// 以假 router 取代真的 router，避免載入所有 view
const { mockRouter } = vi.hoisted(() => ({
  mockRouter: {
    currentRoute: { value: { name: 'collections', fullPath: '/collections?x=1' } },
    push: vi.fn(),
  },
}))
vi.mock('@/router', () => ({ default: mockRouter }))

import apiClient from '@/api/axios'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/authStore'

const respondWith =
  (status: number): AxiosAdapter =>
  async (config: InternalAxiosRequestConfig) => {
    const response = { data: {}, status, statusText: '', headers: {}, config }
    if (status >= 400) {
      throw new AxiosError('fail', 'ERR_BAD_REQUEST', config, undefined, response)
    }
    return response
  }

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    mockRouter.push.mockClear()
    mockRouter.currentRoute.value = { name: 'collections', fullPath: '/collections?x=1' }
    apiClient.defaults.adapter = respondWith(200)
  })

  it('attaches the Bearer token when logged in', async () => {
    useAuthStore().setAuth({ id: 'u1', email: 'a@b.com' }, 'jwt')

    const res = await apiClient.get('/api/collections')
    expect(res.config.headers.Authorization).toBe('Bearer jwt')
  })

  it('omits Authorization when logged out', async () => {
    const res = await apiClient.get('/api/collections')
    expect(res.config.headers.Authorization).toBeUndefined()
  })

  it('on 401 logs out, clears the query cache and redirects to login', async () => {
    const authStore = useAuthStore()
    authStore.setAuth({ id: 'u1', email: 'a@b.com' }, 'jwt')
    const clearSpy = vi.spyOn(queryClient, 'clear')
    apiClient.defaults.adapter = respondWith(401)

    await expect(apiClient.get('/api/collections')).rejects.toBeInstanceOf(AxiosError)

    expect(authStore.isLoggedIn).toBe(false)
    expect(clearSpy).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'login',
      query: { redirect: '/collections?x=1' },
    })
    clearSpy.mockRestore()
  })

  it('does not redirect again when already on the login page', async () => {
    mockRouter.currentRoute.value = { name: 'login', fullPath: '/login' }
    apiClient.defaults.adapter = respondWith(401)

    await expect(apiClient.get('/api/collections')).rejects.toBeInstanceOf(AxiosError)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('ignores 401 from /api/auth/* so the form can show the error', async () => {
    const authStore = useAuthStore()
    authStore.setAuth({ id: 'u1', email: 'a@b.com' }, 'jwt')
    apiClient.defaults.adapter = respondWith(401)

    await expect(apiClient.post('/api/auth/login')).rejects.toBeInstanceOf(AxiosError)

    expect(authStore.isLoggedIn).toBe(true)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('leaves auth state alone on non-401 errors', async () => {
    const authStore = useAuthStore()
    authStore.setAuth({ id: 'u1', email: 'a@b.com' }, 'jwt')
    apiClient.defaults.adapter = respondWith(500)

    await expect(apiClient.get('/api/collections')).rejects.toBeInstanceOf(AxiosError)

    expect(authStore.isLoggedIn).toBe(true)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })
})
