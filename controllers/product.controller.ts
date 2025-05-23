import type { Context } from "hono";

import { ProductService } from "../services/product.service";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { Product } from "../models/product.model";

export class ProductController {
  public static readonly getProductsByCategory = async (ctx: Context) => {
    try {
      const { category_id } = ctx.req.param();

      const { limit = 50, page = 1 } = ctx.req.query() as {
        limit?: number;
        page?: number;
      };

      const productFilter: {
        category_id: string;
        subcategory_id?: string;
      } = {
        category_id,
      };

      const response = await ProductService.getProductsByCategory(
        productFilter,
        {
          limit,
          page,
        }
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

  public static readonly getProduct = async (ctx: Context) => {
    try {
      const { product_id } = ctx.req.param();

      const response = await ProductService.getProductById(product_id);

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

  public static readonly createProduct = async (ctx: Context) => {
    try {
      const {
        name,
        description,
        price,
        image_url,
        category_id,
        subcategory_id,
        meta_data,
        is_active,
        availability_count,
      } = await ctx.req.json();

      const response = await ProductService.createProduct({
        name,
        description,
        price,
        image_url,
        category_id,
        subcategory_id,
        meta_data,
        is_active,
        availability_count,
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

  public static readonly updateProduct = async (ctx: Context) => {
    try {
      const { product_id } = ctx.req.param();

      const {
        name,
        description,
        price,
        image_url,
        category_id,
        subcategory_id,
        meta_data,
        is_active,
        availability_count,
      } = await ctx.req.json();

      await ProductService.updateProduct(product_id, {
        name,
        description,
        price,
        image_url,
        category_id,
        subcategory_id,
        meta_data,
        is_active,
        availability_count,
      });

      return ctx.json({
        message: "Product updated successfully",
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

  public static readonly deleteProduct = async (ctx: Context) => {
    try {
      const { product_id } = ctx.req.param();

      await ProductService.deleteProduct(product_id);

      return ctx.json({
        message: "Product deleted successfully",
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

  public static readonly searchProducts = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      const {
        query,
        limit = 10,
        page = 1,
      } = ctx.req.query() as unknown as {
        query: string;
        limit?: number;
        page?: number;
      };
      const user = await User.findById(user_id);
      if (!user) {
        throw new Error("User not found");
      }
      let searchHistory: string[] = [];
      if (user.meta_data?.searchhistory) {
        try {
          searchHistory = JSON.parse(user.meta_data.searchhistory);
        } catch (err) {
          // if parsing fails, reset history
          searchHistory = [];
        }
      }
      searchHistory.push(query);
      await User.updateById(user_id, {
        meta_data: {
          ...user.meta_data,
          searchhistory: JSON.stringify(searchHistory),
        },
        updated_at: new Date(),
      });
      const response = await ProductService.searchProduct(
        {
          query,
        },
        {
          limit,
          page,
        }
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

  public static readonly getProductsBySubCategory = async (ctx: Context) => {
    try {
      const { subcategory_id } = ctx.req.param();

      const { limit = 10, page = 1 } = ctx.req.query() as {
        limit?: number;
        page?: number;
      };

      const response = await ProductService.getProductsByCategory(
        {
          subcategory_id,
        },
        {
          limit,
          page,
        }
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

  public static readonly getProductsByIds = async (ctx: Context) => {
    try {
      const { product_ids } = ctx.req.queries() as {
        product_ids: string[];
      };

      const response = await ProductService.getProductsByIds(product_ids);

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
  public static readonly getLatestProducts = async (ctx: Context) => {
    try {
      const response = await ProductService.getLatestProducts();
      return ctx.json({
        success: true,
        data: response,
      });
    } catch (error) {
      return ctx.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Failed to fetch latest products",
        },
        500
      );
    }
  };
  public static readonly getUserProducts = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      const response = await ProductService.getUserRecommendedProducts(user_id);
      return ctx.json({
        success: true,
        data: response,
      });
    } catch (error) {
      return ctx.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Failed to fetch recommended products",
        },
        500
      );
    }
  };
  public static readonly getSimilarProducts = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param(); // Get the product ID from the request parameters
      const product = await Product.findById(id); // Find the product by ID

      if (!product) {
        return ctx.json({ success: false, message: "Product not found." }, 404);
      }

      const { category_id, subcategory_id } = product; // Extract category and subcategory IDs

      // Fetch products by subcategory
      // const subcategoryResult = await Product.find({subcategory_id: subcategory_id }); // Ensure this returns an array

      // Fetch products by category
      const categoryResult = await Product.find({ category_id:category_id }); // Ensure this returns an array

// const subcategoryProducts = subcategoryResult.rows;
const categoryProducts = categoryResult.rows;
      // Combine and shuffle products, then select 12 random products
      // const combinedProducts = [...(subcategoryProducts || []), ...(categoryProducts || [])];
      const randomProducts = categoryProducts.sort(() => 0.5 - Math.random()).slice(0, 12);

      return ctx.json({ success: true, data: randomProducts });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };
}
