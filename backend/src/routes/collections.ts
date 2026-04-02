import { Router } from 'express';
import { createCollection } from '../controllers/collectionsController.ts';

const router = Router();

router.post('/', createCollection);

export default router;
