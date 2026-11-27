import { z } from 'zod';

// 長度上限對齊 DB 欄位：name / author_name 為 VarChar(255)、image_id 為 VarChar(100)
const NAME_MAX = 255;
const IMAGE_ID_MAX = 100;
const URL_MAX = 2048;

// 只接受 Unsplash CDN 的 https 圖片網址（含 Unsplash+ 的 plus.unsplash.com）
const unsplashImageUrl = z
  .url({
    protocol: /^https$/,
    hostname: /^(images|plus)\.unsplash\.com$/,
  })
  .max(URL_MAX);

export const CreateCollectionSchema = z.object({
  // 先 trim 再檢查長度，避免只有空白的名稱通過驗證
  name: z.string().trim().min(1).max(NAME_MAX),
});

export const AddImageSchema = z.object({
  image_id: z
    .string()
    .trim()
    .min(1)
    .max(IMAGE_ID_MAX)
    .regex(/^[\w-]+$/),
  image_url: unsplashImageUrl,
  thumb_url: unsplashImageUrl,
  small_url: unsplashImageUrl,
  author_name: z.string().trim().min(1).max(NAME_MAX),
  // Unsplash 的 created_at 帶時區偏移（例如 2016-05-03T11:00:28-04:00）
  published_at: z.iso.datetime({ offset: true }),
});
