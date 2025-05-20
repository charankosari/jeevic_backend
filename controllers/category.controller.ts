import { type Context } from "hono";

import { CategoryService } from "../services/category.service";

export class CategoryController {
  public static readonly getCategories = async (ctx: Context) => {
    try {
      const response = await CategoryService.getCategories();

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

  public static readonly getCategory = async (ctx: Context) => {
    try {
      const { category_id } = ctx.req.param();

      const response = await CategoryService.getCategory(category_id);

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

  public static readonly createCategory = async (ctx: Context) => {
    try {
      const { name, image_url } = await ctx.req.json();

      const response = await CategoryService.createCategory({
        name,
        image_url,
      });
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

  public static readonly updateCategory = async (ctx: Context) => {
    try {
      const { category_id } = ctx.req.param();

      const { name, image_url } = await ctx.req.json();

      await CategoryService.updateCategory(category_id, {
        name,
        image_url,
      });

      return ctx.json({
        message: "Category updated successfully!",
      });
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

  public static readonly deleteCategory = async (ctx: Context) => {
    try {
      const { category_id } = ctx.req.param();

      await CategoryService.deleteCategory(category_id);

      return ctx.json({
        message: "Category deleted successfully!",
      });
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
}
