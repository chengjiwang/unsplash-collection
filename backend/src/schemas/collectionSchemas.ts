import { z } from 'zod';

export const CreateCollectionSchema = z.object({
  name: z.string().min(1),
});

export const AddImageSchema = z.object({
  image_id: z.string().min(1),
  image_url: z.string().min(1),
  thumb_url: z.string().min(1),
  author_name: z.string().min(1),
  published_at: z.string().min(1),
});
