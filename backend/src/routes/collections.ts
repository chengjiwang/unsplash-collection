import { Router } from 'express';
import {
  addImageToCollection,
  createCollection,
  getCollection,
  getCollectionImages,
} from '../controllers/collectionsController.ts';

const router = Router();

router.post('/', createCollection);
router.get('/:id', getCollection);
router.post('/:id/images', addImageToCollection);
router.get('/:id/images', getCollectionImages);

export default router;
