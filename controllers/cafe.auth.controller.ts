import { type Context } from "hono";

import { cafeUserService } from "../services/cafe.user.service";

export class cafeAuthController {
  public static readonly requestAccountAccess = async (ctx: Context) => {
    try {
      const { country_code, phone_number } = await ctx.req.json();

      const response = await cafeUserService.requestAccountAccess(
        country_code,
        phone_number
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

  public static readonly verifyAccountAccess = async (ctx: Context) => {
    try {
      const { country_code, phone_number, otp } = await ctx.req.json();

      const response = await cafeUserService.verifyAccountAccess(
        country_code,
        phone_number,
        otp
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

  public static readonly getUser = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      const response = await cafeUserService.getUser(user_id);

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
