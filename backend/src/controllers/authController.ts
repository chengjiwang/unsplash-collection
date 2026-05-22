import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { getTokenCookieOptions, signToken } from '../lib/auth.js';
import { prisma } from '../lib/prisma.js';

const AuthSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = AuthSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: 'Valid email and password (min 8 chars) are required' });
      return;
    }

    const { email, password } = result.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing !== null) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash },
    });

    const token = signToken(user.id);
    res.cookie('token', token, getTokenCookieOptions());
    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = AuthSchema.safeParse(req.body);
    if (!result.success) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (user === null) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = signToken(user.id);
    res.cookie('token', token, getTokenCookieOptions());
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user === null) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.json({ id: user.id, email: user.email, created_at: user.createdAt });
  } catch (err) {
    next(err);
  }
};
