import { type Context } from "hono";
import { FeaturedProductsModel } from "../models/featured.model";

export class FeaturedController {
  public static readonly createFeaturedProducts = async (ctx: Context) => {
    try {
      const data = await ctx.req.json();
      const newFeaturedProducts = new FeaturedProductsModel(data);
      await newFeaturedProducts.save();
      return ctx.json({ success: true, data: newFeaturedProducts });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };

  public static readonly getFeaturedProducts = async (ctx: Context) => {
    try {
      const featuredProducts = await FeaturedProductsModel.find({});
      return ctx.json({ success: true, data: featuredProducts });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };

  public static readonly updateFeaturedProducts = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      const updateData = await ctx.req.json();

      if (Object.keys(updateData).length === 0) {
        return ctx.json({ message: "No update data provided." }, 400);
      }

      const updatedProducts = await FeaturedProductsModel.updateById(id, updateData);
      return ctx.json({ success: true, data: updatedProducts });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };

  public static readonly deleteFeaturedProducts = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      await FeaturedProductsModel.removeById(id);
      return ctx.json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };
}