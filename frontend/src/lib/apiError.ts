import axios from 'axios'

// Backend error responses are always shaped as `{ error: string }`
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: unknown }>(err)) {
    const message = err.response?.data?.error
    if (typeof message === 'string' && message) return message
  }
  return fallback
}
