import { type Context } from 'hono';
import { BannersService } from '../services/banners.service';

export class BannersController {
  public static readonly createBanner = async (ctx: Context) => {
    try {
      const formData = await ctx.req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return ctx.json({ message: 'File is required' }, 400);
      }

      // Create a minimal bannerData object
      const bannerData = {
        id: '', // or generate a unique ID if needed
        image: '', // This will be set by the service after upload
        created_at: new Date(),
        updated_at: new Date()
      };

      // Create a banner with the image file
      const response = await BannersService.createBanner(bannerData, file);
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({
          message: error.message,
        }, 400);
      }
    }
  };

  public static readonly getBanners = async (ctx: Context) => {
    try {
      const banners = await BannersService.getBanners();
      return ctx.json(banners);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({
          message: error.message,
        }, 400);
      }
    }
  };

  public static readonly deleteBanner = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      const response = await BannersService.deleteBanner(id);
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({
          message: error.message,
        }, 400);
      }
    }
  };

  public static readonly deleteAllBanners = async (ctx: Context) => {
    try {
      const response = await BannersService.deleteAllBanners();
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({
          message: error.message,
        }, 400);
      }
    }
  };
}