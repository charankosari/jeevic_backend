import { Hono } from "hono";

import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const productRoute = new Hono();

productRoute.use(authMiddleware());

productRoute.get("/c/:category_id", ProductController.getProductsByCategory);
productRoute.get(
  "/s/:subcategory_id",
  ProductController.getProductsBySubCategory
);
productRoute.get("/i/:product_id", ProductController.getProduct);

productRoute.get("/search", ProductController.searchProducts);
productRoute.get("/fetch", ProductController.getProductsByIds);

productRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

productRoute.post("/", ProductController.createProduct);
productRoute.patch("/:product_id", ProductController.updateProduct);
productRoute.delete("/:product_id", ProductController.deleteProduct);

export { productRoute };
