import type { Context } from 'hono';

import { GiftOptionsService } from '../services/giftoptions.service';

export class GiftOptionsController {
    public static readonly getGiftOptions = async (ctx: Context) => {
        try {
            const response = await GiftOptionsService.getGiftOptions();

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

    public static readonly getGiftOption = async (ctx: Context) => {
        try {
            const { giftoption_id } = ctx.req.param();

            const response = await GiftOptionsService.getGiftOptionById(giftoption_id);

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

    public static readonly createGiftOption = async (ctx: Context) => {
        try {
            const {
                name,
                image_url,
                description,
                price,
                products,
                meta_data,
                is_active 
            } = await ctx.req.json();

            const response = await GiftOptionsService.createGiftOption({
                name,
                image_url,
                description,
                price,
                products,
                meta_data,
                is_active,
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

    public static readonly updateGiftOption = async (ctx: Context) => {
        try {
            const { giftoption_id } = ctx.req.param();
            const {
                name,
                image_url,
                description,
                price,
                products,
                meta_data,
                is_active,
            } = await ctx.req.json();

            await GiftOptionsService.updateGiftOption(giftoption_id, {
                name,
                image_url,
                description,
                price,
                products,
                meta_data,
                is_active,
            });

            return ctx.json({
                message: 'Gift option updated successfully!',
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

    public static readonly deleteGiftOption = async (ctx: Context) => {
        try {
            const { giftoption_id } = ctx.req.param();

            await GiftOptionsService.deleteGiftOption(giftoption_id);

            return ctx.json({
                message: 'Gift option deleted successfully!',
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
