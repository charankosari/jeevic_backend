import { Hono } from "hono";

import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRoute = new Hono();

authRoute.post("/login-request", AuthController.requestAccountAccess);
// Add support for Email based login
authRoute.post("/verify-account-access", AuthController.verifyAccountAccess);
authRoute.post("/user/email", AuthController.setEmailForVerification);
authRoute.post("/user/verify-email", AuthController.verifyEmail);
// TODO: Add Web Account Creation Route
authRoute.use(authMiddleware());

authRoute.get("/user", AuthController.getUser);
authRoute.patch("/user", AuthController.updateUser);

export { authRoute };
