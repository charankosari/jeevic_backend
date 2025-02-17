import { verify } from "hono/jwt";
import type { Next, Context, MiddlewareHandler } from "hono";

import { UserService } from "../services/user.service";
import { config } from "../config/env";

export const authMiddleware = () : MiddlewareHandler => {
    return async (ctx: Context, next: Next) => {
        try {
            const token = ctx.req.header('Authorization')?.split(' ')[1];

            if (!token) {
                return ctx.json({
                    message: 'Unauthorized',
                    error: 'Token not found',
                }, 401);
            }

            const {
                sub,
                role
            } = await verify(token, config.JWT_SECRET, 'HS512') as {
                sub: string,
                role: 'user' | 'admin',
            };

            const user = await UserService.getUser(sub);

            if (!user) {
                return ctx.json({
                    message: 'Unauthorized! User not found',
                    error: 'User not found',
                }, 401);
            }

            ctx.set('user_id', user.id);
            ctx.set('user_role', role);

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
