import { Hono } from "hono";

import { CategoryController } from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const categoryRoute = new Hono();

categoryRoute.use(authMiddleware());

categoryRoute.get('/', CategoryController.getCategories);
categoryRoute.get('/:category_id', CategoryController.getCategory);

categoryRoute.use(roleMiddleware(true));

categoryRoute.post('/', CategoryController.createCategory);
categoryRoute.patch('/:category_id', CategoryController.updateCategory);
categoryRoute.delete('/:category_id', CategoryController.deleteCategory);

export { categoryRoute };
