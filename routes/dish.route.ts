import { Hono } from "hono";

import { DishController } from "../controllers/dish.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const dishRoute = new Hono();

dishRoute.get("/categories", DishController.getDishCategories);
dishRoute.get("/dishes", DishController.getDishes);
dishRoute.get("/i/:dish_id", DishController.getDishById);
dishRoute.use(authMiddleware());

dishRoute.get(
  "/categories/:dish_category_id",
  DishController.getDishCategoryById
);
dishRoute.get(
  "/dishes/:dish_category_id",
  DishController.getDishesByCategoryId
);

dishRoute.use(roleMiddleware(["admin", "cafe_admin"]));

dishRoute.post("/categories", DishController.createDishCategory);
dishRoute.patch(
  "/categories/:dish_category_id",
  DishController.updateDishCategory
);
dishRoute.delete(
  "/categories/:dish_category_id",
  DishController.deleteDishCategory
);
dishRoute.post("/", DishController.createDish);
dishRoute.patch("/:dish_id", DishController.updateDish);
dishRoute.delete("/:dish_id", DishController.deleteDish);

export { dishRoute };
