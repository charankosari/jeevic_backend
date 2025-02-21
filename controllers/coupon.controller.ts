import { type Context } from 'hono';

import { CouponService } from '../services/coupon.service';

export class CouponController {
    public static readonly getCoupons = async (ctx: Context) => {
        try {
            const response = await CouponService.getCoupons();

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

    public static readonly getCoupon = async (ctx: Context) => {
        try {
            const { coupon_id } = ctx.req.param();

            const response = await CouponService.getCouponById(coupon_id);

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

    public static readonly createCoupon = async (ctx: Context) => {
        try {
            const { code, expires_on, is_one_time, meta_data, no_of_uses } = await ctx.req.json();

            const response = await CouponService.createCoupon({
                code, expires_on, is_one_time, meta_data, no_of_uses
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

    public static readonly updateCoupon = async (ctx: Context) => {
        try {
            const { coupon_id } = ctx.req.param();

            const { code, expires_on, is_one_time, meta_data, no_of_uses } = await ctx.req.json();

            await CouponService.updateCoupon(
                coupon_id,
                {
                    code, expires_on, is_one_time, meta_data, no_of_uses,
                },
            );

            return ctx.json({
                message: 'Coupon updated successfully!',
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

    public static readonly deleteCoupon = async (ctx: Context) => {
        try {
            const { coupon_id } = ctx.req.param();

            await CouponService.deleteCoupon(coupon_id);

            return ctx.json({
                message: 'Coupon deleted successfully!',
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

    public static readonly getCouponByCode = async (ctx: Context) => {
        try {
            const { coupon_code } = await ctx.req.json();

            const response = await CouponService.getCouponByCode(
                coupon_code,
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
