import type { Next, Context, MiddlewareHandler } from "hono";

export const roleMiddleware = (is_admin: boolean) : MiddlewareHandler => {
    return async (ctx: Context, next: Next) => {
        try {
            const role = ctx.get('user_role');

            if (is_admin && role !== 'admin') {
                return ctx.json({
                    message: 'Unauthorized! Admin access only',
                    error: 'Admin access only',
                }, 401);
            }

            return await next();
        }
        catch (error) {
            if(error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    }
}
