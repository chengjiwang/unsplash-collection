import { z } from 'zod';

// id 會拼進上游 URL 與 Content-Disposition，只允許不具路徑／標頭意義的字元
export const PhotoIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

export const SearchQuerySchema = z.object({
  query: z.string().trim().min(1),
  page: z.coerce.number().int().min(1).default(1),
  // Unsplash 的 per_page 上限為 30
  per_page: z.coerce.number().int().min(1).max(30).default(10),
});
