import type { Context } from "hono";

import { ReviewService } from "../services/review.service";
import { User } from "../models/user.model";

export class ReviewController {
  public static readonly getReviewsByProduct = async (ctx: Context) => {
    try {
      const { product_id } = ctx.req.param();

      const response = await ReviewService.getReviewsByProduct(product_id);

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

  public static readonly getReviewsByDish = async (ctx: Context) => {
    try {
      const { dish_id } = ctx.req.param();

      const response = await ReviewService.getReviewsByDish(dish_id);

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

  public static readonly getReview = async (ctx: Context) => {
    try {
      const { review_id } = ctx.req.param();

      const response = await ReviewService.getReviewById(review_id);

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

  public static readonly createReview = async (ctx: Context) => {
    try {
      const { product_id, rating, comment } = await ctx.req.json();

      const user_id = ctx.get("user_id");
      const user = await User.findById(user_id);
      const user_name = `${user.first_name} ${user.last_name}`;
      const response = await ReviewService.createReview({
        user_id,
        product_id,
        user_name,
        rating,
        comment,
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

  public static readonly createDishReview = async (ctx: Context) => {
    try {
      const { dish_id, rating, comment } = await ctx.req.json();

      const user_id = ctx.get("user_id");
      const user = await User.findById(user_id);
      const user_name = `${user.first_name} ${user.last_name}`;
      const response = await ReviewService.createDishReview({
        user_id,
        dish_id,
        user_name,
        rating,
        comment,
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

  public static readonly updateReview = async (ctx: Context) => {
    try {
      const { review_id } = ctx.req.param();

      const { rating, comment, product_id } = await ctx.req.json();

      const user_id = ctx.get("user_id");
      const user = await User.findById(user_id);
      const user_name = `${user.first_name} ${user.last_name}`;
      await ReviewService.updateReview(review_id, {
        user_id,
        rating,
        user_name,
        comment,
        product_id,
      });

      return ctx.json({
        message: "Review updated successfully!",
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

  public static readonly deleteReview = async (ctx: Context) => {
    try {
      const { review_id } = ctx.req.param();

      await ReviewService.deleteReview(review_id);

      return ctx.json({
        message: "Review deleted successfully!",
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

  public static readonly getAverageRatingForProduct = async (ctx: Context) => {
    try {
      const { product_id } = ctx.req.param();

      const response =
        await ReviewService.getAverageRatingForProduct(product_id);

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

  public static readonly getAverageRatingForDish = async (ctx: Context) => {
    try {
      const { dish_id } = ctx.req.param();

      const response = await ReviewService.getAverageRatingForDish(dish_id);

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
