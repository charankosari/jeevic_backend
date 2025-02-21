import type { Context } from "hono";

import { WishlistService } from "../services/wishlist.service";

export class WishlistController {
    public static readonly getWishlist = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const response = await WishlistService.getWishlist(user_id);

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

    public static readonly addToWishlist = async (ctx: Context) => {
        try {
            const { product_id } = await ctx.req.json();
            
            const user_id = ctx.get('user_id');

            const response = await WishlistService.addToWishlist({
                user_id,
                product_id
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

    public static readonly removeFromWishlist = async (ctx: Context) => {
        try {
            const { product_id } = await ctx.req.json();
            
            const user_id = ctx.get('user_id');

            await WishlistService.removeFromWishlist(
                user_id,
                product_id
            );

            return ctx.json({
                message: 'Product removed from wishlist',
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
}
