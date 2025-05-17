import { CafeBanner, type CBanner } from '../models/banners.model';
import { UploaderService } from './upload.service';

export class BannersService {
  public static readonly createBanner = async (bannerData: CBanner, file: File) => {
    // Upload the image file
    const uploadResult = await UploaderService.upload(file);
    bannerData.image = uploadResult.url; // Set the uploaded image URL

    const newBanner = await CafeBanner.create(bannerData);
    return {
      message: 'Banner created successfully',
      banner: newBanner,
    };
  };

  public static readonly updateBanner = async (bannerId: string, bannerData: Partial<CBanner>, file?: File) => {
    if (file) {
      // Upload the new image file if provided
      const uploadResult = await UploaderService.upload(file);
      bannerData.image = uploadResult.url; // Update the image URL
    }

    const updatedBanner = await CafeBanner.updateById(bannerId, bannerData);
    return {
      message: 'Banner updated successfully',
      banner: updatedBanner,
    };
  };

  public static readonly getBanners = async () => {
    const banners = await CafeBanner.find({});
    return banners.rows;
  };

  public static readonly deleteBanner = async (bannerId: string) => {
    await CafeBanner.removeById(bannerId);
    return {
      message: 'Banner deleted successfully',
    };
  };

  public static readonly deleteAllBanners = async () => {
    const banners = await CafeBanner.find({});
    for (const banner of banners.rows) {
      await CafeBanner.removeById(banner.id);
    }
    return {
      message: 'All banners deleted successfully',
    };
  };
}