import { type Context } from "hono";

import { CartService } from "../services/cart.service";

export class CartController {
  public static readonly addToCart = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      const { product_id, quantity, meta_data } = await ctx.req.json();
      const response = await CartService.addToCart(
        user_id,
        product_id,
        quantity,
        meta_data
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

  public static readonly updateCart = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      const { product_id, quantity, meta_data } = await ctx.req.json();

      await CartService.updateCart(user_id, product_id, quantity, meta_data);

      return ctx.json({
        message: "Cart updated successfully!",
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

  public static readonly removeFromCart = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      const { product_id } = await ctx.req.json();

      await CartService.removeFromCart(user_id, product_id);

      return ctx.json({
        message: "Cart removed successfully!",
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

  public static readonly getCart = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      const response = await CartService.getCart(user_id);

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

  public static readonly clearCart = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      await CartService.clearCart(user_id);

      return ctx.json({
        message: "Cart cleared successfully!",
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
}
