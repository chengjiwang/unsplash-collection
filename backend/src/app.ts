import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from './routes/auth.js';
import collectionsRouter from './routes/collections.js';
import unsplashRouter from './routes/unsplash.js';

const app = express();

app.use(
  cors({
    origin: process.env['FRONTEND_URL'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/unsplash', unsplashRouter);

app.use(errorHandler);

export default app;
