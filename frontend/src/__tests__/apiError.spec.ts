import { describe, it, expect } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { getApiErrorMessage } from '@/lib/apiError'

const axiosErrorWith = (data: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
  })

describe('getApiErrorMessage', () => {
  it('reads `error` from the backend response body', () => {
    expect(getApiErrorMessage(axiosErrorWith({ error: 'Email already in use' }), 'fallback')).toBe(
      'Email already in use',
    )
  })

  it('falls back when the body has no usable `error`', () => {
    expect(getApiErrorMessage(axiosErrorWith({ message: 'nope' }), 'fallback')).toBe('fallback')
    expect(getApiErrorMessage(axiosErrorWith({ error: '' }), 'fallback')).toBe('fallback')
    expect(getApiErrorMessage(axiosErrorWith({ error: 42 }), 'fallback')).toBe('fallback')
    expect(getApiErrorMessage(axiosErrorWith(undefined), 'fallback')).toBe('fallback')
  })

  it('falls back for axios errors without a response (network error)', () => {
    expect(getApiErrorMessage(new AxiosError('Network Error'), 'fallback')).toBe('fallback')
  })

  it('falls back for non-axios errors', () => {
    expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback')
    expect(getApiErrorMessage('boom', 'fallback')).toBe('fallback')
  })
})
