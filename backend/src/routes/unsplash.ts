import { Router } from 'express';
import {
  downloadPhoto,
  getPhoto,
  searchPhotos,
} from '../controllers/unsplashController.js';

const router = Router();

router.get('/search', searchPhotos);
router.get('/photos/:id', getPhoto);
router.get('/photos/:id/download', downloadPhoto);

export default router;
