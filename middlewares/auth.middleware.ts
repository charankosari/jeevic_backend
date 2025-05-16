import { verify } from "hono/jwt";
import type { Next, Context, MiddlewareHandler } from "hono";

import { UserService } from "../services/user.service";
import { cafeUserService } from "../services/cafe.user.service";
import { config } from "../config/env";

export const authMiddleware = (): MiddlewareHandler => {
  return async (ctx: Context, next: Next) => {
    try {
      const token = ctx.req.header("Authorization")?.split(" ")[1];

      if (!token) {
        return ctx.json(
          {
            message: "Unauthorized",
            error: "Token not found",
          },
          401
        );
      }

      // Verify the token and handle potential errors
      const payload = await verify(token, config.JWT_SECRET, "HS512");

      if (!payload || typeof payload !== "object") {
        return ctx.json(
          { message: "Invalid token format", error: "Authentication failed" },
          401
        );
      }

      const sub = payload.sub as string;
      const role = payload.role as "user" | "admin" | "cafeuser";

      if (!sub || !role) {
        return ctx.json(
          { message: "Invalid token claims", error: "Authentication failed" },
          401
        );
      }

      console.log(sub, role);
      let currentUser = null;
      if (role === "cafeuser") {
        currentUser = await cafeUserService.getUser(sub);
      } else {
        currentUser = await UserService.getUser(sub);
      }

      if (!currentUser) {
        return ctx.json(
          { message: "Unauthorized! User not found", error: "User not found" },
          401
        );
      }

      ctx.set("user_id", currentUser.id);
      ctx.set("user_role", role);

      return await next();
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }

      // Handle non-Error exceptions
      return ctx.json(
        {
          message: "Authentication failed",
        },
        400
      );
    }
  };
};
