import { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import {
  AddImageSchema,
  CreateCollectionSchema,
} from '../schemas/collectionSchemas.js';

export const getCollections = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { image_id, name, exclude_image_id } = req.query;

    const where: Prisma.CollectionWhereInput = { userId: req.userId };

    const imagesFilter: Prisma.CollectionImageListRelationFilter = {};
    if (typeof image_id === 'string' && image_id.length > 0) {
      imagesFilter.some = { imageId: image_id };
    }
    if (typeof exclude_image_id === 'string' && exclude_image_id.length > 0) {
      imagesFilter.none = { imageId: exclude_image_id };
    }
    if (Object.keys(imagesFilter).length > 0) {
      where.images = imagesFilter;
    }

    if (typeof name === 'string' && name.length > 0) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const collections = await prisma.collection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { images: true } },
        images: {
          orderBy: { addedAt: 'desc' },
          take: 3,
          select: { thumbUrl: true, smallUrl: true },
        },
      },
    });

    res.json(
      collections.map((c) => ({
        id: c.id,
        name: c.name,
        created_at: c.createdAt,
        image_count: c._count.images,
        preview_images: c.images.map((img) => ({
          thumb_url: img.thumbUrl,
          small_url: img.smallUrl,
        })),
      }))
    );
  } catch (err) {
    next(err);
  }
};

export const getCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params['id']);

    const [collection, imageCount] = await Promise.all([
      prisma.collection.findUnique({ where: { id } }),
      prisma.collectionImage.count({ where: { collectionId: id } }),
    ]);

    if (collection === null || collection.userId !== req.userId) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    res.json({
      id: collection.id,
      name: collection.name,
      created_at: collection.createdAt,
      image_count: imageCount,
    });
  } catch (err) {
    next(err);
  }
};

export const createCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = CreateCollectionSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: 'Collection name must be 1-255 characters' });
      return;
    }

    const { name } = result.data;

    const existing = await prisma.collection.findUnique({
      where: { userId_name: { userId: req.userId, name } },
    });

    if (existing !== null) {
      res.status(400).json({ error: 'Collection name already exists' });
      return;
    }

    const collection = await prisma.collection.create({
      data: { name, userId: req.userId },
    });

    res.status(201).json({
      id: collection.id,
      name: collection.name,
      created_at: collection.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const addImageToCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collectionId = String(req.params['id']);

    const result = AddImageSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid image data' });
      return;
    }

    const {
      image_id,
      image_url,
      thumb_url,
      small_url,
      author_name,
      published_at,
    } = result.data;

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (collection === null || collection.userId !== req.userId) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const existing = await prisma.collectionImage.findUnique({
      where: {
        collectionId_imageId: { collectionId, imageId: image_id },
      },
    });

    if (existing !== null) {
      res
        .status(409)
        .json({ error: 'Image already exists in this collection' });
      return;
    }

    const image = await prisma.collectionImage.create({
      data: {
        collectionId,
        imageId: image_id,
        imageUrl: image_url,
        thumbUrl: thumb_url,
        smallUrl: small_url,
        authorName: author_name,
        publishedAt: new Date(published_at),
      },
    });

    res.status(201).json({
      id: image.id,
      collection_id: image.collectionId,
      image_id: image.imageId,
      added_at: image.addedAt,
    });
  } catch (err) {
    next(err);
  }
};

export const getCollectionImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collectionId = String(req.params['id']);

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (collection === null || collection.userId !== req.userId) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const images = await prisma.collectionImage.findMany({
      where: { collectionId },
      orderBy: { addedAt: 'desc' },
    });

    res.json(
      images.map((img) => ({
        id: img.id,
        image_id: img.imageId,
        image_url: img.imageUrl,
        thumb_url: img.thumbUrl,
        small_url: img.smallUrl,
        author_name: img.authorName,
        published_at: img.publishedAt,
        added_at: img.addedAt,
      }))
    );
  } catch (err) {
    next(err);
  }
};

export const removeImageFromCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collectionId = String(req.params['id']);
    const imageId = String(req.params['imageId']);

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (collection === null || collection.userId !== req.userId) {
      res.status(404).json({ error: 'Collection not found' });
      return;
    }

    const image = await prisma.collectionImage.findUnique({
      where: {
        collectionId_imageId: { collectionId, imageId },
      },
    });

    if (image === null) {
      res.status(404).json({ error: 'Image not found in this collection' });
      return;
    }

    await prisma.collectionImage.delete({
      where: {
        collectionId_imageId: { collectionId, imageId },
      },
    });

    res.json({ message: 'Image removed from collection' });
  } catch (err) {
    next(err);
  }
};
