import { type Context } from "hono";
import { BannersService } from "../services/banners.service";
import { type MBanner } from "../models/banners.model";
import { FeaturedSectionModel } from "../models/banners.model";
export class BannersController {
  public static readonly createBanner = async (ctx: Context) => {
    try {
      const formData = await ctx.req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return ctx.json({ message: "File is required" }, 400);
      }

      // Create a minimal bannerData object
      const bannerData = {
        id: "", // or generate a unique ID if needed
        image: "", // This will be set by the service after upload
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Create a banner with the image file
      const response = await BannersService.createBanner(bannerData, file);
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly getBanners = async (ctx: Context) => {
    try {
      const banners = await BannersService.getBanners();
      return ctx.json(banners);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
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
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly deleteAllBanners = async (ctx: Context) => {
    try {
      const response = await BannersService.deleteAllBanners();
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly createMainBanner = async (ctx: Context) => {
    try {
      const { image, video, text1, text2, buttontext, linkto } =
        await ctx.req.json();

      // Build bannerData dynamically — only include non-empty fields
      const bannerData: Partial<MBanner> = {};
      if (image) bannerData.image = image;
      if (video) bannerData.video = video;
      if (text1) bannerData.text1 = text1;
      if (text2) bannerData.text2 = text2;
      if (buttontext) bannerData.buttontext = buttontext;
      if (linkto) bannerData.linkto = linkto;

      // If nothing was sent, respond with a validation error
      if (Object.keys(bannerData).length === 0) {
        return ctx.json(
          { message: "Please provide at least an image or a video URL." },
          400
        );
      }

      const response = await BannersService.createMainBanner(
        bannerData as MBanner
      );
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };
  public static readonly updateMainBanner = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      const bannerData: Partial<MBanner> = await ctx.req.json();

      // If no data is provided to update
      if (Object.keys(bannerData).length === 0) {
        return ctx.json({ message: "No update data provided." }, 400);
      }

      const response = await BannersService.updateMainBanner(id, bannerData);
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly getMainBanner = async (ctx: Context) => {
    try {
      const banners = await BannersService.getMainBanners();
      return ctx.json(banners);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly deleteMainBanner = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      const response = await BannersService.deleteMainBanner(id);
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly deleteAllMainBanners = async (ctx: Context) => {
    try {
      const response = await BannersService.deleteAllMainBanners();
      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };
  public static readonly createFeaturedSection = async (ctx: Context) => {
    try {
      const data = await ctx.req.json();
      console.log("Data received:", data);
      const newFeaturedSection = new FeaturedSectionModel(data);
      console.log("Data:", newFeaturedSection);

      await newFeaturedSection.save();
      return ctx.json({ success: true, data: newFeaturedSection });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };

  public static readonly getFeaturedSections = async (ctx: Context) => {
    try {
      const featuredSections = await FeaturedSectionModel.find({});
      return ctx.json({ success: true, data: featuredSections });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };

  public static readonly deleteFeaturedSection = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      await FeaturedSectionModel.removeById(id);
      return ctx.json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };

  public static readonly deleteAllFeaturedSections = async (ctx: Context) => {
    try {
      await FeaturedSectionModel.remove({});
      return ctx.json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };
  public static readonly updateFeaturedSection = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      const updateData = await ctx.req.json();

      // Ensure updateData is not empty
      if (Object.keys(updateData).length === 0) {
        return ctx.json({ message: "No update data provided." }, 400);
      }

      const updatedSection = await FeaturedSectionModel.updateById(id, updateData);
      return ctx.json({ success: true, data: updatedSection });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };
}
