import { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

// body-parser / http-errors 這類錯誤會帶上 status 與 expose
interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  expose?: boolean;
}

const PRISMA_STATUS: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: 'Resource already exists' },
  P2025: { status: 404, message: 'Resource not found' },
};

const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // 完整錯誤只寫進 log，不回給客戶端
  console.error(err);

  if (res.headersSent) {
    res.end();
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = PRISMA_STATUS[err.code];
    if (mapped) {
      res.status(mapped.status).json({ error: mapped.message });
      return;
    }
  }

  const status = err.status ?? err.statusCode;
  if (status !== undefined && status >= 400 && status < 500) {
    res.status(status).json({ error: err.expose ? err.message : 'Bad Request' });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
