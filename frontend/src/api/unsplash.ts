import type { UnsplashPhoto } from '@/types'
import apiClient from './axios'

export const searchPhotos = (query: string, page = 1) =>
  apiClient.get<{
    results: UnsplashPhoto[]
    total: number
    total_pages: number
  }>('/api/unsplash/search', { params: { query, page } })

export const getPhotoById = (id: string) =>
  apiClient.get<UnsplashPhoto>(`/api/unsplash/photos/${id}`)

export const downloadPhotoById = (id: string) =>
  apiClient.get(`/api/unsplash/photos/${id}/download`, { responseType: 'blob' })
