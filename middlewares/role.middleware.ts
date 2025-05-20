import type { Next, Context, MiddlewareHandler } from "hono";

// Generic middleware that checks if the user has one of the allowed roles
export const roleMiddleware = (allowedRoles: string[]): MiddlewareHandler => {
  return async (ctx: Context, next: Next) => {
    try {
      const role = ctx.get("user_role");

      if (!allowedRoles.includes(role)) {
        return ctx.json(
          {
            message: "Unauthorized! Access denied for your role",
            error: "Access denied",
          },
          401
        );
      }

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
    }
  };
};

// Specific middlewares for different admin roles
export const superAdminMiddleware = roleMiddleware(["admin"]);
export const cafeAdminMiddleware = roleMiddleware(["cafe_admin"]);
export const ecommerceAdminMiddleware = roleMiddleware(["ecommerce_admin"]);
