import { QueryClient } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'

const MAX_RETRIES = 2

// Unsplash 照片與搜尋結果幾乎不變，快取久一點以節省 rate limit
export const UNSPLASH_STALE_TIME = 5 * 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      // 4xx（401、404 等）重試也不會成功，直接顯示錯誤；網路錯誤與 5xx 才重試
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status !== undefined && status >= 400 && status < 500) return false
        return failureCount < MAX_RETRIES
      },
    },
  },
})
