import apiClient from './axios'
import type { AuthUser } from '@/types'

export interface AuthResponse {
  user: AuthUser
}

export const register = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/api/auth/register', { email, password })

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/api/auth/login', { email, password })

export const logout = () => apiClient.post('/api/auth/logout')

export const getMe = () => apiClient.get<AuthUser>('/api/auth/me')
