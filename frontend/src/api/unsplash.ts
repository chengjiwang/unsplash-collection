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

// 原圖可能數 MB，不套用預設 10 秒 timeout
export const downloadPhotoById = (id: string) =>
  apiClient.get<Blob>(`/api/unsplash/photos/${id}/download`, {
    responseType: 'blob',
    timeout: 0,
  })
