import { type Context } from "hono";

import { SubCategoryService } from "../services/subcategory.service";

export class SubcategoryController {
  public static readonly getSubCategories = async (ctx: Context) => {
    try {
      const response = await SubCategoryService.getSubCategories();

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

  public static readonly getSubCategory = async (ctx: Context) => {
    try {
      const { subcategory_id } = ctx.req.param();

      const response =
        await SubCategoryService.getSubCategoryById(subcategory_id);

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
      const { name, category_id, image_url } = await ctx.req.json();

      const response = await SubCategoryService.createSubCategory({
        name,
        category_id,
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
      const { subcategory_id } = ctx.req.param();

      const { name, category_id, image_url } = await ctx.req.json();

      await SubCategoryService.updateSubCategory(subcategory_id, {
        name,
        category_id,
        image_url,
      });

      return ctx.json({
        message: "Sub Category updated successfully!",
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
      const { subcategory_id } = ctx.req.param();

      await SubCategoryService.deleteSubCategory(subcategory_id);

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

  public static readonly getSubCategoriesByCategory = async (ctx: Context) => {
    try {
      const { category_id } = ctx.req.param();

      const response =
        await SubCategoryService.getSubCategoriesByCategory(category_id);

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
}
