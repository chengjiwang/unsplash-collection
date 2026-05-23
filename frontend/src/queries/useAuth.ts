import { useMutation } from '@tanstack/vue-query'
import { login, logout, register } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'

export const useLogin = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password).then((r) => r.data),
    onSuccess: (data) => {
      authStore.setAuth(data.user)
      const redirect = (route.query.redirect as string) || '/collections'
      router.push(redirect)
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
      authStore.setAuth(data.user)
      router.push('/collections')
    },
  })
}

export const useLogout = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      authStore.logout()
      router.push('/login')
    },
  })
}
