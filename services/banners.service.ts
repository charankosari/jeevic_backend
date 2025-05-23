import {
  CafeBanner,
  type CBanner,
  MainBanner,
  type MBanner,
} from "../models/banners.model";
import { UploaderService } from "./upload.service";

export class BannersService {
  public static readonly createBanner = async (
    bannerData: CBanner,
    file: File
  ) => {
    // Upload the image file
    const uploadResult = await UploaderService.upload(file);
    bannerData.image = uploadResult.url; // Set the uploaded image URL

    const newBanner = await CafeBanner.create(bannerData);
    return {
      message: "Banner created successfully",
      banner: newBanner,
    };
  };

  public static readonly updateBanner = async (
    bannerId: string,
    bannerData: Partial<CBanner>,
    file?: File
  ) => {
    if (file) {
      // Upload the new image file if provided
      const uploadResult = await UploaderService.upload(file);
      bannerData.image = uploadResult.url; // Update the image URL
    }

    const updatedBanner = await CafeBanner.updateById(bannerId, bannerData);
    return {
      message: "Banner updated successfully",
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
      message: "Banner deleted successfully",
    };
  };

  public static readonly deleteAllBanners = async () => {
    const banners = await CafeBanner.find({});
    for (const banner of banners.rows) {
      await CafeBanner.removeById(banner.id);
    }
    return {
      message: "All banners deleted successfully",
    };
  };
  public static readonly createMainBanner = async (
    bannerData: Partial<MBanner>
  ) => {
    // Add timestamps manually if needed, though Ottoman's schema defaults cover this
    const newBanner = await MainBanner.create({
      ...bannerData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return {
      message: "Banner created successfully",
      banner: newBanner,
    };
  };
  public static readonly updateMainBanner = async (
    bannerId: string,
    bannerData: Partial<MBanner>
  ) => {
    const updatedBanner = await MainBanner.updateById(bannerId, {
      ...bannerData,
      updated_at: new Date(),
    });

    return {
      message: "Banner updated successfully",
      banner: updatedBanner,
    };
  };

  public static readonly getMainBanners = async () => {
    const banners = await MainBanner.find({});
    return banners.rows;
  };

  public static readonly deleteMainBanner = async (bannerId: string) => {
    await MainBanner.removeById(bannerId);
    return {
      message: "Banner deleted successfully",
    };
  };

  public static readonly deleteAllMainBanners = async () => {
    const banners = await MainBanner.find({});
    for (const banner of banners.rows) {
      await MainBanner.removeById(banner.id);
    }
    return {
      message: "All banners deleted successfully",
    };
  };
}
