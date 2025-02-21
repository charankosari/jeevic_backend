import type { Context } from 'hono';

import { GiftCardService } from '../services/giftcard.service';

export class GiftCardController {
    public static readonly getGiftCards = async (ctx: Context) => {
        try {
            const response = await GiftCardService.getGiftCards();

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

    public static readonly getGiftCard = async (ctx: Context) => {
        try {
            const { giftcard_id } = ctx.req.param();

            const response = await GiftCardService.getGiftCardById(giftcard_id);

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

    public static readonly createGiftCard = async (ctx: Context) => {
        try {
            const { code, expires_on, meta_data } = await ctx.req.json();

            const response = await GiftCardService.createGiftCard({
                code,
                expires_on,
                meta_data
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

    public static readonly deleteGiftCard = async (ctx: Context) => {
        try {
            const { giftcard_id } = ctx.req.param();

            await GiftCardService.deleteGiftCard(giftcard_id);

            return ctx.json({
                message: 'Gift card deleted successfully!',
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

    public static readonly updateGiftCard = async (ctx: Context) => {
        try {
            const { giftcard_id } = ctx.req.param();

            const { code, expires_on, meta_data, is_redeemed } = await ctx.req.json();

            await GiftCardService.updateGiftCard(
                giftcard_id,
                {
                    code,
                    expires_on,
                    is_redeemed,
                    meta_data,
                },
            );

            return ctx.json({
                message: 'Gift card updated successfully!',
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

    public static readonly getGiftCardByCode = async (ctx: Context) => {
        try {
            const { giftcard_code } = await ctx.req.json();

            const response = await GiftCardService.getGiftCardByCode(
                giftcard_code,
            );

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