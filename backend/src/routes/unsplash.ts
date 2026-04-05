import { Router } from 'express';
import { getPhoto, searchPhotos } from '../controllers/unsplashController.ts';

const router = Router();

router.get('/search', searchPhotos);
router.get('/photos/:id', getPhoto);

export default router;
