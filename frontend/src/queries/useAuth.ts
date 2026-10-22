import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { login, logout, register } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'

// 只接受站內絕對路徑；陣列、null、外部網址（`//`、`/\`）與登入頁都回退到預設頁
const getSafeRedirect = (value: unknown) =>
  typeof value === 'string' &&
  value.startsWith('/') &&
  !value.startsWith('//') &&
  !value.startsWith('/\\') &&
  !value.startsWith('/login')
    ? value
    : '/collections'

export const useLogin = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password).then((r) => r.data),
    onSuccess: (data) => {
      authStore.setAuth(data.user, data.token)
      router.push(getSafeRedirect(route.query.redirect))
    },
  })
}

export const useRegister = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      register(email, password).then((r) => r.data),
    onSuccess: (data) => {
      authStore.setAuth(data.user, data.token)
      router.push('/collections')
    },
  })
}

export const useLogout = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      authStore.logout()
      // 有 staleTime 時快取不會自動 refetch，需清除以免下個帳號看到上個帳號的收藏
      queryClient.clear()
      router.push('/login')
    },
  })
}
