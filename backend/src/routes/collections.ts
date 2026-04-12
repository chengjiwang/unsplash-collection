import { Router } from 'express';
import {
  addImageToCollection,
  createCollection,
  getCollection,
  getCollectionImages,
  getCollections,
  removeImageFromCollection,
} from '../controllers/collectionsController.js';

const router = Router();

router.get('/', getCollections);
router.post('/', createCollection);
router.get('/:id', getCollection);
router.post('/:id/images', addImageToCollection);
router.get('/:id/images', getCollectionImages);
router.delete('/:id/images/:imageId', removeImageFromCollection);

export default router;
