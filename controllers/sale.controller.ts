import type { Context } from "hono";

import { SaleService } from "../services/sale.service";

export class SaleController {
    public static readonly getSales = async (ctx: Context) => {
        try {
            const response = await SaleService.getSales();

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

    public static readonly getSale = async (ctx: Context) => {
        try {
            const { sale_id } = ctx.req.param();

            const response = await SaleService.getSaleById(sale_id);

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

    public static readonly createSale = async (ctx: Context) => {
        try {
            const {
                name,
                image_url,
                description,
                start_date,
                end_date,
                discount_percentage,
                sale_type,
                product_ids,
                category_ids,
                subcategory_ids,
                meta_data,
            } = await ctx.req.json();

            const response = await SaleService.createSale({
                name,
                image_url,
                description,
                start_date,
                end_date,
                discount_percentage,
                sale_type,
                product_ids,
                category_ids,
                subcategory_ids,
                meta_data,
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

    public static readonly updateSale = async (ctx: Context) => {
        try {
            const { sale_id } = ctx.req.param();

            const {
                name,
                image_url,
                description,
                start_date,
                end_date,
                discount_percentage,
                sale_type,
                product_ids,
                category_ids,
                subcategory_ids,
                meta_data,
            } = await ctx.req.json();

            await SaleService.updateSale(sale_id, {
                name,
                image_url,
                description,
                start_date,
                end_date,
                discount_percentage,
                sale_type,
                product_ids,
                category_ids,
                subcategory_ids,
                meta_data,
            });

            return ctx.json({
                message: 'Sale updated successfully!',
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

    public static readonly deleteSale = async (ctx: Context) => {
        try {
            const { sale_id } = ctx.req.param();

            await SaleService.deleteSale(sale_id);

            return ctx.json({
                message: 'Sale deleted successfully!',
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

    public static readonly getSaleProducts = async (ctx: Context) => {
        try {
            const { sale_id, sale_type } = ctx.req.param();

            const {
                page = 1,
                limit = 10,
            } = ctx.req.query() as {
                page?: number;
                limit?: number;
            };

            const response = await SaleService.getSaleProducts(sale_id, sale_type, { page, limit, });

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
    
    public static readonly getCurrentSalesOverProduct = async (ctx: Context) => {
        try {
            const { product_id } = ctx.req.param();

            const response = await SaleService.getCurrentSalesOverProduct(product_id);

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
