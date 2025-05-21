import { type Context } from "hono";

import { UserService } from "../services/user.service";
import { User } from "../models/user.model";

export class AuthController {
  public static readonly requestAccountAccess = async (ctx: Context) => {
    try {
      const { country_code, phone_number } = await ctx.req.json();

      const response = await UserService.requestAccountAccess(
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

      const response = await UserService.verifyAccountAccess(
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

      const response = await UserService.getUser(user_id);

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

  public static readonly updateUser = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      const { first_name, last_name, profile_picture } = await ctx.req.json();

      const response = await UserService.updateUser(user_id, {
        first_name,
        last_name,
        profile_picture,
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

  public static readonly setEmailForVerification = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      const { email } = await ctx.req.json();

      const response = await UserService.setEmailForVerification(
        user_id,
        email
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

  public static readonly verifyEmail = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      const { otp } = await ctx.req.json();

      const response = await UserService.verifyEmail(user_id, otp);

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
  public static readonly getAllUsers = async (ctx: Context) => {
    try {
      const response = await UserService.getAllUsers();

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
  public static readonly deleteUserById = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      await User.findOneAndRemove({ id: user_id });
      const response = { success: true, message: "user deleted successfully" };

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
