import { describe, it, expect } from 'vitest'
import { formatPhotoCount } from '@/lib/format'

describe('formatPhotoCount', () => {
  it('uses singular for 1', () => {
    expect(formatPhotoCount(1)).toBe('1 photo')
  })

  it('uses plural for 0 and many', () => {
    expect(formatPhotoCount(0)).toBe('0 photos')
    expect(formatPhotoCount(5)).toBe('5 photos')
  })
})
