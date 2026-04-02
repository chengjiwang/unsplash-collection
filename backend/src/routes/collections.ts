import { Router } from 'express';
import {
  createCollection,
  getCollection,
} from '../controllers/collectionsController.ts';

const router = Router();

router.post('/', createCollection);
router.get('/:id', getCollection);

export default router;
