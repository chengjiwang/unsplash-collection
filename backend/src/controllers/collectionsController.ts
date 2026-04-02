import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma.ts';

export const createCollection = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.body as { name?: string };

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Collection name is required' });
      return;
    }

    const trimmedName = name.trim();

    const existing = await prisma.collection.findUnique({
      where: { name: trimmedName },
    });

    if (existing !== null) {
      res.status(400).json({ error: 'Collection name is required' });
      return;
    }

    const collection = await prisma.collection.create({
      data: { name: trimmedName },
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
