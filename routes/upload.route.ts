import { Hono } from 'hono';

import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const uploadRoute = new Hono();

uploadRoute.use(authMiddleware());

uploadRoute.put('/', UploadController.uploadFile);

export { uploadRoute };