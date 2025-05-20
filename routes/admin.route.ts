import { Hono } from "hono";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { cafeAuthController } from "../controllers/cafe.auth.controller";
import { AdminController } from "../controllers/admin.controller";
const adminRoute = new Hono();
adminRoute.use(authMiddleware());
//  only for admin routes
adminRoute.use(roleMiddleware(["admin"]));
adminRoute.post('/staff',AdminController.createEmployee)
adminRoute.get('/staff',AdminController.getEmployees)
adminRoute.get('/staff/:staff_id',AdminController.getEmployeeById)
adminRoute.delete('/staff/:staff_id',AdminController.deleteEmployee)
adminRoute.patch('/staff/:staff_id',AdminController.updateEmployee)

adminRoute.use(roleMiddleware(["admin", "cafe_admin"]));
adminRoute.get("/users", cafeAuthController.getUsers);
adminRoute.get("/allstats", AdminController.getAdminStats);

export { adminRoute };
