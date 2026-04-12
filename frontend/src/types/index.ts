export interface UnsplashPhoto {
  id: string
  urls: {
    regular: string
    thumb: string
    small: string
  }
  user: {
    name: string
    profile_image?: {
      small: string
    }
  }
  created_at: string
  description: string | null
  alt_description: string | null
  links: {
    download: string
  }
}

export interface Collection {
  id: string
  name: string
  created_at: string
  image_count: number
  preview_images: { thumb_url: string; small_url: string }[]
}

export interface CollectionImage {
  id: string
  image_id: string
  image_url: string
  thumb_url: string
  small_url: string
  author_name: string
  published_at: string
  added_at: string
}
