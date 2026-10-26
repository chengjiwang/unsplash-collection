import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { login, logout, register } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { getSafeRedirect } from '@/lib/redirect'

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
