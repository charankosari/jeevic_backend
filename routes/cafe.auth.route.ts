import { Hono } from "hono";

import { cafeAuthController } from "../controllers/cafe.auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const cafeAuthRoute = new Hono();

cafeAuthRoute.post("/login-request", cafeAuthController.requestAccountAccess);
// Add support for Email based login
cafeAuthRoute.post(
  "/verify-account-access",
  cafeAuthController.verifyAccountAccess
);

// TODO: Add Web Account Creation Route
cafeAuthRoute.use(authMiddleware());

cafeAuthRoute.get("/user", cafeAuthController.getUser);

export { cafeAuthRoute };
