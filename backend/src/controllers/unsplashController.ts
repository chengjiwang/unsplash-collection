import { NextFunction, Request, Response } from 'express';

const UNSPLASH_API_BASE = 'https://api.unsplash.com';

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

    const { query, page = '1', per_page = '10' } = req.query;

    if (typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ error: 'query parameter is required' });
      return;
    }

    const params = new URLSearchParams({
      query: query.trim(),
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
      res
        .status(response.status)
        .json({ error: 'Failed to fetch from Unsplash' });
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

    const { id } = req.params;

    const response = await fetch(`${UNSPLASH_API_BASE}/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
    });

    if (response.status === 404) {
      res.status(404).json({ error: 'Photo not found' });
      return;
    }

    if (!response.ok) {
      res
        .status(response.status)
        .json({ error: 'Failed to fetch from Unsplash' });
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

    const { id } = req.params;

    // Trigger download tracking as required by Unsplash API guidelines
    const trackResponse = await fetch(
      `${UNSPLASH_API_BASE}/photos/${id}/download`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      },
    );

    if (!trackResponse.ok) {
      res
        .status(trackResponse.status)
        .json({ error: 'Failed to track download' });
      return;
    }

    const trackData = (await trackResponse.json()) as { url: string };

    const imageUrl = trackData.url;

    // Fetch the actual image and send it back as a downloadable file
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      res.status(imageResponse.status).json({ error: 'Failed to fetch image' });
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
