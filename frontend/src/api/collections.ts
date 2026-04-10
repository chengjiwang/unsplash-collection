import type { Collection, CollectionImage } from '@/types'
import apiClient from './axios'

export const getCollections = (params?: {
  image_id?: string
  name?: string
  exclude_image_id?: string
}) => apiClient.get<Collection[]>('/api/collections', { params })

export const addImageToCollection = (
  collectionId: string,
  payload: Omit<CollectionImage, 'id' | 'added_at'>,
) => apiClient.post(`/api/collections/${collectionId}/images`, payload)

export const removeImageFromCollection = (collectionId: string, imageId: string) =>
  apiClient.delete(`/api/collections/${collectionId}/images/${imageId}`)
