import { Hono } from "hono";

import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRoute = new Hono();

authRoute.post('/login-request', AuthController.requestAccountAccess);
authRoute.post('/verify-account-access', AuthController.verifyAccountAccess);

authRoute.use(authMiddleware());

authRoute.get('/user', AuthController.getUser);
authRoute.patch('/user', AuthController.updateUser);

export { authRoute };