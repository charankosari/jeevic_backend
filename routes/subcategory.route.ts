import { Hono } from "hono";

import { SubcategoryController } from "../controllers/subcategory.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const subcategoryRoute = new Hono();

subcategoryRoute.get("/", SubcategoryController.getSubCategories);
subcategoryRoute.get("/:subcategory_id", SubcategoryController.getSubCategory);
subcategoryRoute.get(
  "/c/:category_id",
  SubcategoryController.getSubCategoriesByCategory
);
subcategoryRoute.use(authMiddleware());

subcategoryRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

subcategoryRoute.post("/", SubcategoryController.createCategory);
subcategoryRoute.patch(
  "/:subcategory_id",
  SubcategoryController.updateCategory
);
subcategoryRoute.delete(
  "/:subcategory_id",
  SubcategoryController.deleteCategory
);

export { subcategoryRoute };
