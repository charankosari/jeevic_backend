import { Hono } from "hono";
import { adminController } from "../controllers/admin.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { cafeAuthController } from "../controllers/cafe.auth.controller";
const adminRoute = new Hono();
adminRoute.use(authMiddleware());
adminRoute.use(roleMiddleware(true));
adminRoute.get("/users", cafeAuthController.getUsers);

export { adminRoute };