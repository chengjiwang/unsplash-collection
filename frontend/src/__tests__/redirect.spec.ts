import { describe, it, expect } from 'vitest'
import { getSafeRedirect, DEFAULT_REDIRECT } from '@/lib/redirect'

describe('getSafeRedirect', () => {
  it('accepts in-app absolute paths', () => {
    expect(getSafeRedirect('/photos/abc')).toBe('/photos/abc')
    expect(getSafeRedirect('/collections/1?x=1')).toBe('/collections/1?x=1')
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['array', ['/photos/abc']],
    ['empty string', ''],
    ['relative path', 'photos/abc'],
    ['absolute URL', 'https://evil.com'],
    ['protocol-relative URL', '//evil.com'],
    ['backslash URL', '/\\evil.com'],
    ['login page', '/login?redirect=/collections'],
  ])('falls back to default for %s', (_, value) => {
    expect(getSafeRedirect(value)).toBe(DEFAULT_REDIRECT)
  })
})
