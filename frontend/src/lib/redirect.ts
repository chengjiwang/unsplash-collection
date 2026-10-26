export const DEFAULT_REDIRECT = '/collections'

// 只接受站內絕對路徑；陣列、null、外部網址（`//`、`/\`）與登入頁都回退到預設頁
export const getSafeRedirect = (value: unknown): string =>
  typeof value === 'string' &&
  value.startsWith('/') &&
  !value.startsWith('//') &&
  !value.startsWith('/\\') &&
  !value.startsWith('/login')
    ? value
    : DEFAULT_REDIRECT
