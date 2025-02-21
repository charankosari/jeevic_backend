import type { Context } from "hono";

import { ProductService } from "../services/product.service";

export class ProductController {
    public static readonly getProductsByCategory = async (ctx: Context) => {
        try {
            const { category_id } = ctx.req.param();

            const {
                limit = 10,
                page = 1,
            } = ctx.req.query() as {
                limit?: number,
                page?: number,
            }

            const productFilter : {
                category_id: string,
                subcategory_id?: string,
            } = {
                category_id,
            }

            const response = await ProductService.getProductsByCategory(productFilter, {
                limit,
                page
            });

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getProduct = async (ctx: Context) => {
        try {
            const { product_id } = ctx.req.param();

            const response = await ProductService.getProductById(product_id);

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
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
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
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
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
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
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly searchProducts = async (ctx: Context) => {
        try {
            const { 
                query,
                limit = 10,
                page = 1,
            } = ctx.req.query() as unknown as {
                query: string,
                limit?: number,
                page?: number,
            };

            const response = await ProductService.searchProduct({
                query
            }, {
                limit,
                page,
            });

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getProductsBySubCategory = async (ctx: Context) => {
        try {
            const { subcategory_id } = ctx.req.param();

            const {
                limit = 10,
                page = 1,
            } = ctx.req.query() as {
                limit?: number,
                page?: number,
            }

            const response = await ProductService.getProductsByCategory({
                subcategory_id,
            }, {
                limit,
                page
            });

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getProductsByIds = async (ctx: Context) => {
        try {
            const {
                product_ids,
            } = ctx.req.queries() as {
                product_ids: string[],
            }

            const response = await ProductService.getProductsByIds(product_ids);

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };
}
