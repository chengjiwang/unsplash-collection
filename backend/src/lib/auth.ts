import jwt from 'jsonwebtoken';
import type { CookieOptions } from 'express';

export const signToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env['JWT_SECRET']!, {
    expiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
  } as jwt.SignOptions);
};

export const getTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: (process.env['NODE_ENV'] === 'production' ? 'none' : 'lax') as
    | 'none'
    | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
