import { Hono } from 'hono';
import { BannersController } from '../controllers/banners.controller';

const bannerRoute = new Hono();

bannerRoute.post('/create', BannersController.createBanner);
bannerRoute.get('/', BannersController.getBanners);
bannerRoute.delete('/:id', BannersController.deleteBanner);
bannerRoute.delete('/all', BannersController.deleteAllBanners);

export { bannerRoute };