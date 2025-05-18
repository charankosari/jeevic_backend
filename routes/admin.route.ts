import { Hono } from "hono";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { cafeAuthController } from "../controllers/cafe.auth.controller";
import { AdminController } from "../controllers/admin.controller";
const adminRoute = new Hono();
adminRoute.use(authMiddleware());
adminRoute.use(roleMiddleware(true));
adminRoute.get("/users", cafeAuthController.getUsers);
adminRoute.get("/allstats", AdminController.getAdminStats);

export { adminRoute };