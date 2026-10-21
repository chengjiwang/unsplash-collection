import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { queryClient } from '@/lib/queryClient'
import router from '@/router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})

// 401 自動登出並導向登入頁
// 略過 /api/auth/*：登入失敗也回 401，需交給頁面顯示錯誤訊息
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/api/auth/')
    if (error.response?.status === 401 && !isAuthRequest) {
      const authStore = useAuthStore()
      authStore.logout()
      queryClient.clear()

      const current = router.currentRoute.value
      if (current.name !== 'login') {
        router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
