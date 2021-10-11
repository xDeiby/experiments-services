import { Router } from 'express';
import multer from '../../libs/multer';
import { allImages, modifyImage, removeImage, saveImage } from './services';

const imageRouter = Router();

// Save image and details
imageRouter.post('/', multer.single('file'), saveImage);

// Modify image details
imageRouter.put('/:id', multer.single('file'), modifyImage);

// Get Image
imageRouter.get('/', allImages);

// Remove Image
imageRouter.delete('/:id', removeImage);

export default imageRouter;
