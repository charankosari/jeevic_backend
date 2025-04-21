import type { Context } from "hono";

import { ReviewService } from "../services/review.service";

export class ReviewController {
    public static readonly getReviewsByProduct = async (ctx: Context) => {
        try {
            const { product_id } = ctx.req.param();

            const response = await ReviewService.getReviewsByProduct(product_id);

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

    public static readonly getReviewsByDish = async (ctx: Context) => {
        try {
            const { product_id } = ctx.req.param();

            const response = await ReviewService.getReviewsByDish(product_id);

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

    public static readonly getReview = async (ctx: Context) => {
        try {
            const { review_id } = ctx.req.param();

            const response = await ReviewService.getReviewById(review_id);

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

    public static readonly createReview = async (ctx: Context) => {
        try {
            const { product_id, rating, comment } = await ctx.req.json();
            
            const user_id = ctx.get('user_id');

            const response = await ReviewService.createReview({
                user_id,
                product_id,
                rating,
                comment
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

    public static readonly updateReview = async (ctx: Context) => {
        try {
            const { review_id } = ctx.req.param();

            const { rating, comment, product_id } = await ctx.req.json();

            const user_id = ctx.get('user_id');

            await ReviewService.updateReview(review_id, {
                user_id,
                rating,
                comment,
                product_id
            });

            return ctx.json({
                message: 'Review updated successfully!',
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

    public static readonly deleteReview = async (ctx: Context) => {
        try {
            const { review_id } = ctx.req.param();

            await ReviewService.deleteReview(review_id);

            return ctx.json({
                message: 'Review deleted successfully!',
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

    public static readonly getAverageRatingForProduct = async (ctx: Context) => {
        try {
            const { product_id } = ctx.req.param();

            const response = await ReviewService.getAverageRatingForProduct(product_id);

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

    public static readonly getAverageRatingForDish = async (ctx: Context) => {
        try {
            const { dish_id } = ctx.req.param();

            const response = await ReviewService.getAverageRatingForDish(dish_id);

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
