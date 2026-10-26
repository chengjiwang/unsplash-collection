import type { Collection, CollectionDetail, CollectionImage, CollectionQueryParams } from '@/types'
import apiClient from './axios'

export const getCollections = (params?: CollectionQueryParams) =>
  apiClient.get<Collection[]>('/api/collections', { params })

export const createCollection = (name: string) =>
  apiClient.post<Collection>('/api/collections', { name })

export const getCollection = (collectionId: string) =>
  apiClient.get<CollectionDetail>(`/api/collections/${collectionId}`)

export const getCollectionImages = (collectionId: string) =>
  apiClient.get<CollectionImage[]>(`/api/collections/${collectionId}/images`)

export const addImageToCollection = (
  collectionId: string,
  payload: Omit<CollectionImage, 'id' | 'added_at'>,
) => apiClient.post(`/api/collections/${collectionId}/images`, payload)

export const removeImageFromCollection = (collectionId: string, imageId: string) =>
  apiClient.delete(`/api/collections/${collectionId}/images/${imageId}`)
