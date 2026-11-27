import { NextFunction, Request, Response } from 'express';
import {
  PhotoIdSchema,
  SearchQuerySchema,
} from '../schemas/unsplashSchemas.js';

const UNSPLASH_API_BASE = 'https://api.unsplash.com';

/**
 * Translate a failed upstream (Unsplash / image CDN) response into a status
 * for our own client. Upstream 401/403 mean *our* access key is invalid or
 * the quota is used up — never forward them as-is, or the frontend treats
 * them as an expired login and logs the user out.
 */
const sendUpstreamError = (
  res: Response,
  upstream: globalThis.Response,
  context: string,
): void => {
  const rateLimited =
    upstream.status === 429 ||
    (upstream.status === 403 &&
      upstream.headers.get('x-ratelimit-remaining') === '0');

  console.error(`[unsplash] ${context} failed: upstream ${upstream.status}`);

  if (upstream.status === 404) {
    res.status(404).json({ error: 'Photo not found' });
    return;
  }

  if (rateLimited) {
    res
      .status(429)
      .json({ error: 'Unsplash rate limit exceeded, please try again later' });
    return;
  }

  res.status(502).json({ error: 'Failed to fetch from Unsplash' });
};

export const searchPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      res.status(500).json({ error: 'Unsplash API key not configured' });
      return;
    }

    const parsed = SearchQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const queryInvalid = parsed.error.issues.some(
        (issue) => issue.path[0] === 'query',
      );
      res.status(400).json({
        error: queryInvalid
          ? 'query parameter is required'
          : 'Invalid pagination parameters',
      });
      return;
    }

    const { query, page, per_page } = parsed.data;

    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(per_page),
    });

    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      },
    );

    if (!response.ok) {
      sendUpstreamError(res, response, 'search');
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      res.status(500).json({ error: 'Unsplash API key not configured' });
      return;
    }

    const parsedId = PhotoIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ error: 'Invalid photo id' });
      return;
    }
    const id = parsedId.data;

    const response = await fetch(
      `${UNSPLASH_API_BASE}/photos/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      },
    );

    if (!response.ok) {
      sendUpstreamError(res, response, 'get photo');
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const downloadPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      res.status(500).json({ error: 'Unsplash API key not configured' });
      return;
    }

    const parsedId = PhotoIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ error: 'Invalid photo id' });
      return;
    }
    const id = parsedId.data;

    // Trigger download tracking as required by Unsplash API guidelines
    const trackResponse = await fetch(
      `${UNSPLASH_API_BASE}/photos/${encodeURIComponent(id)}/download`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      },
    );

    if (!trackResponse.ok) {
      sendUpstreamError(res, trackResponse, 'track download');
      return;
    }

    const trackData = (await trackResponse.json()) as { url: string };

    const imageUrl = trackData.url;

    // Fetch the actual image and send it back as a downloadable file
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      sendUpstreamError(res, imageResponse, 'fetch image');
      return;
    }

    const contentType =
      imageResponse.headers.get('content-type') ?? 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${id}.jpg"`);

    const buffer = await imageResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    next(err);
  }
};
