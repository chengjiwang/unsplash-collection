import cors from 'cors';
import express from 'express';
import errorHandler from './middlewares/errorHandler.ts';
import collectionsRouter from './routes/collections.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/collections', collectionsRouter);

app.use(errorHandler);

export default app;
